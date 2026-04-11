import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export function getActionErrorMessage(error: unknown, fallback = "Something went wrong. Please try again.") {
  if (error instanceof ZodError) {
    return error.issues[0]?.message || fallback;
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
