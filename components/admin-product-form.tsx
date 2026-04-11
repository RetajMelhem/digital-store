"use client";

import { useEffect, useState } from "react";

type ProductFormValues = {
  nameEn: string;
  nameAr: string;
  slug: string;
  category: string;
  price: number;
  image: string;
  descriptionEn: string;
  descriptionAr: string;
  deliveryType: "CUSTOMER_ACCOUNT" | "PRIVATE_ACCOUNT";
  isActive: boolean;
  isFeatured: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminProductForm({
  action,
  heading,
  submitLabel,
  initialValues,
  extraActions
}: {
  action: (formData: FormData) => void | Promise<void>;
  heading: string;
  submitLabel: string;
  initialValues: ProductFormValues;
  extraActions?: React.ReactNode;
}) {
  const [nameEn, setNameEn] = useState(initialValues.nameEn);
  const [slug, setSlug] = useState(initialValues.slug);
  const [image, setImage] = useState(initialValues.image);
  const [slugEdited, setSlugEdited] = useState(Boolean(initialValues.slug));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(nameEn));
    }
  }, [nameEn, slugEdited]);

  async function handleFileUpload(file: File) {
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData
      });

      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Image upload failed.");
      }

      setImage(payload.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form action={action} className="mx-auto max-w-5xl card grid gap-4 p-6 md:grid-cols-2">
      <h1 className="md:col-span-2 text-3xl font-black text-foreground">{heading}</h1>

      <div>
        <label className="label">Name (English)</label>
        <input
          className="input"
          name="nameEn"
          value={nameEn}
          onChange={(event) => setNameEn(event.target.value)}
          required
        />
      </div>

      <div>
        <label className="label">Name (Arabic)</label>
        <input className="input" name="nameAr" defaultValue={initialValues.nameAr} required />
      </div>

      <div>
        <label className="label">Slug</label>
        <input
          className="input"
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugEdited(true);
            setSlug(event.target.value);
          }}
          required
        />
      </div>

      <div>
        <label className="label">Category</label>
        <select className="input" name="category" defaultValue={initialValues.category}>
          {["AI", "Gaming", "Social Media"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Price</label>
        <input className="input" name="price" type="number" step="0.01" defaultValue={initialValues.price} required />
      </div>

      <div>
        <label className="label">Delivery Type</label>
        <select className="input" name="deliveryType" defaultValue={initialValues.deliveryType}>
          <option value="PRIVATE_ACCOUNT">Private account</option>
          <option value="CUSTOMER_ACCOUNT">Customer account activation</option>
        </select>
      </div>

      <div className="md:col-span-2">
        <label className="label">Image URL</label>
        <input
          className="input"
          name="image"
          value={image}
          onChange={(event) => setImage(event.target.value)}
          required
        />
        <div className="mt-3 rounded-2xl border border-dashed border-line bg-surface-muted p-4">
          <label className="label">Upload Image</label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="input"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              void handleFileUpload(file);
              event.currentTarget.value = "";
            }}
            disabled={uploading}
          />
          <p className="mt-2 text-xs text-muted">
            Upload JPG, PNG, WEBP, or GIF up to 5 MB. The uploaded image URL will fill in automatically.
          </p>
          {uploading ? <p className="mt-2 text-sm font-medium text-foreground">Uploading image...</p> : null}
          {uploadError ? <p className="mt-2 text-sm font-medium text-red-600">{uploadError}</p> : null}
        </div>
      </div>

      {image ? (
        <div className="md:col-span-2 overflow-hidden rounded-3xl border border-line bg-surface-muted p-4">
          <div className="mb-3 text-sm font-semibold text-muted">Preview</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Preview" className="h-64 w-full rounded-2xl object-cover" />
        </div>
      ) : null}

      <div>
        <label className="label">Description (English)</label>
        <textarea className="input min-h-40" name="descriptionEn" defaultValue={initialValues.descriptionEn} required />
      </div>

      <div>
        <label className="label">Description (Arabic)</label>
        <textarea className="input min-h-40" name="descriptionAr" defaultValue={initialValues.descriptionAr} required />
      </div>

      <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground">
        <input type="checkbox" name="isActive" defaultChecked={initialValues.isActive} className="h-4 w-4" />
        Visible in storefront
      </label>

      <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-line bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground">
        <input type="checkbox" name="isFeatured" defaultChecked={initialValues.isFeatured} className="h-4 w-4" />
        Show in featured products on homepage
      </label>

      <div className="md:col-span-2 flex flex-wrap gap-3">
        <button className="btn-primary">{submitLabel}</button>
        {extraActions}
      </div>
    </form>
  );
}
