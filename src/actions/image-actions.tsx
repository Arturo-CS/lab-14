"use server";

import { v2 as cloudinary } from 'cloudinary';
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import sharp from 'sharp';
import { EventEmitter } from 'events';

// Configuración de Cloudinary
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Crear un EventEmitter para manejar eventos
const eventEmitter = new EventEmitter();

// Función para optimizar la imagen
async function optimizeImage(buffer: Buffer): Promise<Buffer> {
    return sharp(buffer)
        .resize(800)
        .webp({ quality: 80 })
        .toBuffer();
}

async function uploadToCloudinary(buffer: Buffer) {
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
        const bytes = await imageFile.arrayBuffer();
        let buffer = Buffer.from(bytes);

        // Optimizar la imagen
        buffer = await optimizeImage(buffer);

        const uploadResult = await uploadToCloudinary(buffer) as any;

        const image = await prisma.image.create({
            data: {
                name,
                imageUrl: uploadResult.secure_url,
            },
        });

        // Emitir evento de imagen creada
        eventEmitter.emit('imageSaved', { id: image.id, name: image.name });

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
            const bytes = await imageFile.arrayBuffer();
            let buffer = Buffer.from(bytes);

            // Optimizar la imagen
            buffer = await optimizeImage(buffer);

            const uploadResult = await uploadToCloudinary(buffer) as any;
            updateData.imageUrl = uploadResult.secure_url;
        }

        const updatedImage = await prisma.image.update({
            where: { id },
            data: updateData,
        });

        // Emitir evento de imagen actualizada
        eventEmitter.emit('imageUpdate', { id: updatedImage.id, name: updatedImage.name });

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

// Listener para el evento
eventEmitter.on('imageSaved', async (imageData) => {
    await prisma.activityLog.create({
      data: {
        action: 'IMAGE_SAVED',
        imageId: imageData.id,
        imageName: imageData.name,
      },
    });
  });

eventEmitter.on('imageUpdate', async (imageData) => {
    await prisma.activityLog.create({
      data: {
        action: 'IMAGE_UPDATED',
        imageId: imageData.id,
        imageName: imageData.name,
      },
    });
  });
