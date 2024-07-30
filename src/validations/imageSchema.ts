import { z } from "zod";

// Esquema para la creación de una imagen
export const createImageSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  imageFile: z
    .instanceof(File, { message: "Se requiere un archivo de imagen" })
    .refine((file) => file.size <= 5000000, "El archivo no debe exceder 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Solo se permiten archivos JPG, PNG o WebP"
    ),
});

// Esquema para la actualización de una imagen
export const updateImageSchema = z.object({
  name: z
    .string()
    .min(1, "El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  imageFile: z
    .instanceof(File, { message: "Se requiere un archivo de imagen" })
    .refine((file) => file.size <= 5000000, "El archivo no debe exceder 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "Solo se permiten archivos JPG, PNG o WebP"
    )
    .optional(),
});

// Tipo para la creación de una imagen
export type CreateImageInput = z.infer<typeof createImageSchema>;

// Tipo para la actualización de una imagen
export type UpdateImageInput = z.infer<typeof updateImageSchema>;
