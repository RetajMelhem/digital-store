import { productSchema } from "@/lib/validators";

export function parseProductFormData(formData: FormData) {
  return productSchema.parse({
    nameEn: String(formData.get("nameEn") || "").trim(),
    nameAr: String(formData.get("nameAr") || "").trim(),
    slug: String(formData.get("slug") || "").trim().toLowerCase(),
    descriptionEn: String(formData.get("descriptionEn") || "").trim(),
    descriptionAr: String(formData.get("descriptionAr") || "").trim(),
    category: String(formData.get("category") || "").trim(),
    image: String(formData.get("image") || "").trim(),
    price: String(formData.get("price") || "").trim(),
    deliveryType: String(formData.get("deliveryType") || "").trim(),
    isActive: formData.get("isActive") === "on",
    isFeatured: formData.get("isFeatured") === "on"
  });
}
