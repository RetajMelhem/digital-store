import { z } from "zod";

const jordanPhoneErrorMessage = "Please enter a valid Jordan phone number starting with 07 or +9627";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20)
});

export const createOrderSchema = z.object({
  customerName: z.string().min(2).max(80),
  phone: z
    .string()
    .trim()
    .min(10, jordanPhoneErrorMessage)
    .max(20, jordanPhoneErrorMessage)
    .refine((value) => {
      const normalized = value.replace(/[\s-]/g, "");
      return /^(07\d{8}|\+9627\d{8})$/.test(normalized);
    }, jordanPhoneErrorMessage),
  items: z.array(cartItemSchema).min(1).max(20),
  honeypot: z.string().max(0).optional().default("")
});

export const productSchema = z.object({
  nameEn: z.string().min(2).max(120),
  nameAr: z.string().min(2).max(120),
  slug: z.string().min(2).max(140).regex(/^[a-z0-9-]+$/),
  descriptionEn: z.string().min(10).max(5000),
  descriptionAr: z.string().min(10).max(5000),
  category: z.string().min(2).max(60),
  image: z.string().min(1).max(2048),
  price: z.coerce.number().positive().max(9999),
  deliveryType: z.enum(["CUSTOMER_ACCOUNT", "PRIVATE_ACCOUNT"]),
  isActive: z.coerce.boolean()
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "DELIVERED"]),
  note: z.string().max(2000).optional().default("")
});

export const orderNotesSchema = z.object({
  notes: z.string().max(5000).optional().default("")
});

export const reviewModerationSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "HIDDEN"])
});
