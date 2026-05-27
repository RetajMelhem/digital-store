import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

type Viewport = {
  name: string;
  width: number;
  height: number;
};

type AuditRoute = {
  key: string;
  path: string;
  requiresAdmin?: boolean;
};

type OverflowIssue = {
  type: "horizontal-scroll" | "element-overflow";
  detail: string;
};

const ROOT_DIR = process.cwd();
const AUDIT_DIR = path.join(ROOT_DIR, "responsive-audit");
const SCREENSHOT_DIR = path.join(AUDIT_DIR, "screenshots");
const REPORT_PATH = path.join(AUDIT_DIR, "report.json");
const ENV_PATH = path.join(ROOT_DIR, ".env");
const ADMIN_ROUTE = "/admin-secret-9f3k";
const viewports: Viewport[] = [
  { name: "360x800", width: 360, height: 800 },
  { name: "390x844", width: 390, height: 844 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1366x768", width: 1366, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
  { name: "1920x1080", width: 1920, height: 1080 }
];

const issuesByViewport = new Map<string, Record<string, OverflowIssue[]>>();

function loadEnvFile(filePath: string) {
  const content = fsSync.readFileSync(filePath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex < 0) continue;
    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();
    const value =
      rawValue.startsWith('"') && rawValue.endsWith('"')
        ? rawValue.slice(1, -1)
        : rawValue.startsWith("'") && rawValue.endsWith("'")
          ? rawValue.slice(1, -1)
          : rawValue;
    if (!process.env[key]) process.env[key] = value;
  }
}

async function waitForAppReady(baseUrl: string) {
  const deadline = Date.now() + 60_000;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${baseUrl}/ar`, { redirect: "manual" });
      if (response.ok || response.status === 307 || response.status === 308) return;
    } catch {
      // Allow the app a moment longer to finish starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Application at ${baseUrl} did not become ready within 60 seconds.`);
}

async function gotoWithRetry(page: import("@playwright/test").Page, targetPath: string) {
  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const response = await page.goto(targetPath, { waitUntil: "networkidle" });
      return response;
    } catch (error) {
      lastError = error;
      await page.waitForTimeout(1_000);
    }
  }

  throw lastError;
}

function routeToFilename(route: AuditRoute) {
  return route.key.replace(/[^a-z0-9-]+/gi, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function buildRoutes() {
  loadEnvFile(ENV_PATH);
  const prisma = new PrismaClient();

  try {
    const [activeProduct, anyProduct, firstOrder] = await Promise.all([
      prisma.product.findFirst({ where: { isActive: true }, orderBy: { createdAt: "asc" }, select: { slug: true } }),
      prisma.product.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } }),
      prisma.order.findFirst({ orderBy: { createdAt: "asc" }, select: { id: true } })
    ]);

    if (!activeProduct) throw new Error("No active product found for responsive audit.");
    if (!anyProduct) throw new Error("No product found for admin product detail audit.");
    if (!firstOrder) throw new Error("No order found for admin order detail audit.");

    const successQuery = new URLSearchParams({
      orderId: firstOrder.id,
      amount: "9.99",
      customerName: "Responsive Audit",
      phone: "0799999999"
    }).toString();

    const routes: AuditRoute[] = [
      { key: "root-redirect", path: "/" },
      { key: "ar-home", path: "/ar" },
      { key: "en-home", path: "/en" },
      { key: "ar-products", path: "/ar/products" },
      { key: "en-products", path: "/en/products" },
      { key: "ar-product-detail", path: `/ar/products/${activeProduct.slug}` },
      { key: "en-product-detail", path: `/en/products/${activeProduct.slug}` },
      { key: "ar-cart", path: "/ar/cart" },
      { key: "en-cart", path: "/en/cart" },
      { key: "ar-checkout", path: "/ar/checkout" },
      { key: "en-checkout", path: "/en/checkout" },
      { key: "ar-order-success", path: `/ar/order-success?${successQuery}` },
      { key: "en-order-success", path: `/en/order-success?${successQuery}` },
      { key: "admin-login", path: ADMIN_ROUTE },
      { key: "admin-dashboard", path: ADMIN_ROUTE, requiresAdmin: true },
      { key: "admin-products", path: `${ADMIN_ROUTE}/products`, requiresAdmin: true },
      { key: "admin-product-new", path: `${ADMIN_ROUTE}/products/new`, requiresAdmin: true },
      { key: "admin-product-detail", path: `${ADMIN_ROUTE}/products/${anyProduct.id}`, requiresAdmin: true },
      { key: "admin-orders", path: `${ADMIN_ROUTE}/orders`, requiresAdmin: true },
      { key: "admin-order-detail", path: `${ADMIN_ROUTE}/orders/${firstOrder.id}`, requiresAdmin: true },
      { key: "admin-reviews", path: `${ADMIN_ROUTE}/reviews`, requiresAdmin: true }
    ];

    return routes;
  } finally {
    await prisma.$disconnect();
  }
}

async function loginAdmin(page: import("@playwright/test").Page) {
  await page.goto(ADMIN_ROUTE, { waitUntil: "networkidle" });
  await page.getByPlaceholder("Admin password").fill(process.env.ADMIN_PASSWORD || "");
  await page.getByRole("button", { name: "Unlock Dashboard" }).click();
  await expect(page.getByRole("heading", { name: "Admin Dashboard" })).toBeVisible({ timeout: 30_000 });
}

test.describe("responsive audit", () => {
  let routes: AuditRoute[] = [];

  test.beforeAll(async () => {
    routes = await buildRoutes();
    await fs.mkdir(AUDIT_DIR, { recursive: true });
    await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
    await waitForAppReady("http://127.0.0.1:3000");
  });

  for (const viewport of viewports) {
    test(`capture ${viewport.name}`, async ({ browser, baseURL }) => {
      const context = await browser.newContext({
        baseURL,
        viewport: { width: viewport.width, height: viewport.height }
      });

      try {
        const page = await context.newPage();
        const viewportIssues: Record<string, OverflowIssue[]> = {};
        let adminLoggedIn = false;

        for (const route of routes) {
          if (route.requiresAdmin && !adminLoggedIn) {
            await loginAdmin(page);
            adminLoggedIn = true;
          }

          const response = await gotoWithRetry(page, route.path);
          expect(response?.ok() || response?.status() === 307 || response?.status() === 308).toBeTruthy();

          await page.waitForTimeout(400);

          const issues = await page.evaluate(() => {
            const findings: OverflowIssue[] = [];
            const root = document.documentElement;
            const maxWidth = Math.max(
              root.scrollWidth,
              document.body?.scrollWidth || 0,
              root.offsetWidth,
              document.body?.offsetWidth || 0
            );

            if (maxWidth - window.innerWidth > 1) {
              findings.push({
                type: "horizontal-scroll",
                detail: `Document width ${maxWidth}px exceeds viewport width ${window.innerWidth}px`
              });
            }

            const seen = new Set<string>();
            const elements = Array.from(document.querySelectorAll<HTMLElement>("body *"));
            for (const element of elements) {
              const style = window.getComputedStyle(element);
              if (["svg", "path"].includes(element.tagName.toLowerCase())) continue;
              if (element.classList.contains("pointer-events-none")) continue;
              if (element.closest(".pointer-events-none")) continue;
              if (style.display === "none" || style.visibility === "hidden") continue;
              const rect = element.getBoundingClientRect();
              if (rect.width <= 0 || rect.height <= 0) continue;
              if (rect.right <= 0 || rect.left >= window.innerWidth) continue;
              if (rect.left < -1 || rect.right - window.innerWidth > 1) {
                const label =
                  element.id
                    ? `#${element.id}`
                    : element.className
                      ? `${element.tagName.toLowerCase()}.${String(element.className).trim().split(/\s+/).slice(0, 2).join(".")}`
                      : element.tagName.toLowerCase();
                if (!seen.has(label)) {
                  findings.push({
                    type: "element-overflow",
                    detail: `${label} extends beyond viewport (${Math.round(rect.left)}..${Math.round(rect.right)})`
                  });
                  seen.add(label);
                }
              }
              if (findings.length >= 12) break;
            }

            return findings;
          });

          viewportIssues[route.key] = issues;

          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, `${routeToFilename(route)}_${viewport.name}.png`),
            fullPage: true
          });
        }

        issuesByViewport.set(viewport.name, viewportIssues);
      } finally {
        await context.close();
      }
    });
  }

  test.afterAll(async () => {
    const report = {
      generatedAt: new Date().toISOString(),
      screenshotDir: path.relative(ROOT_DIR, SCREENSHOT_DIR),
      viewports,
      routes,
      issues: Object.fromEntries(issuesByViewport.entries())
    };
    await fs.writeFile(REPORT_PATH, JSON.stringify(report, null, 2), "utf8");
  });
});
