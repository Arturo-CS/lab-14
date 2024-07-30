"use server";

import { v2 as cloudinary } from 'cloudinary';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Configuración de Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(file: File) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder: "my_uploads" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(buffer);
    });
}

export async function CreateImage(formData: FormData) {
    const name = formData.get('name') as string;
    const imageFile = formData.get('imageFile') as File;

    if (!name || !imageFile) {
        throw new Error("Nombre de imagen e imagen son requeridos");
    }

    try {
        const uploadResult = await uploadToCloudinary(imageFile) as any;

        await prisma.image.create({
            data: {
                name,
                imageUrl: uploadResult.secure_url,
            },
        });

        revalidatePath("/images");
        return { success: true };
    } catch (error) {
        console.error("Error al crear la imagen:", error);
        return { success: false, error: "No se pudo crear la imagen" };
    }
}

export async function UpdateImage(formData: FormData) {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const imageFile = formData.get('imageFile') as File | null;

    if (!id || !name) {
        return { success: false, error: "ID y nombre son requeridos" };
    }

    try {
        let updateData: { name: string; imageUrl?: string } = { name };

        if (imageFile) {
            const uploadResult = await uploadToCloudinary(imageFile) as any;
            updateData.imageUrl = uploadResult.secure_url;
        }

        await prisma.image.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/images");
        return { success: true };
    } catch (error) {
        console.error("Error al actualizar la imagen:", error);
        return { success: false, error: "No se pudo actualizar la imagen" };
    }
}

export async function GetImage(id: string) {
    return await prisma.image.findUnique({
        where: { id },
    });
}

export async function removeImage(formData: FormData) {
    const id = formData.get('id') as string;

    if (!id) {
        throw new Error("ID de imagen no proporcionado");
    }

    try {
        const image = await prisma.image.findUnique({
            where: { id },
        });

        if (image) {
            const publicId = image.imageUrl.split('/').pop()?.split('.')[0];
            if (publicId) {
                await cloudinary.uploader.destroy(publicId);
            }

            await prisma.image.delete({
                where: { id },
            });
        } else {
            throw new Error("Imagen no encontrada");
        }

        revalidatePath("/images");
        return { success: true };
    } catch (error) {
        console.error("Error al eliminar la imagen:", error);
        return { success: false, error: "No se pudo eliminar la imagen" };
    }
}