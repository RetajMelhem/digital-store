import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

function formatFieldName(path: (string | number)[]) {
  const field = path[0];
  if (typeof field !== "string" || !field) return "";

  return field
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
}

export function getActionErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error instanceof ZodError) {
    const firstIssue = error.issues[0];
    if (!firstIssue) return fallback;

    const fieldName = formatFieldName(firstIssue.path);
    return fieldName ? `${fieldName}: ${firstIssue.message}` : firstIssue.message || fallback;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return "This slug is already in use. Choose a different slug.";
    }

    if (error.code === "P2025") {
      return "The selected item no longer exists.";
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
