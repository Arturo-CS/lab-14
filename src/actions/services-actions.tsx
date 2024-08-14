"use server";

import prisma from "@/lib/prisma";
import { serviceSchema } from "@/validations/serviceSchema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function createService(data: z.infer<typeof serviceSchema>) {
  const { name, description, categoryId } = data;

  await prisma.service.create({
    data: {
      name,
      description,
      category: {
        connect: { id: parseInt(categoryId) }
      }
    },
  });

  revalidatePath("/services");
  redirect("/services");
}

export async function updateService(id: number, data: z.infer<typeof serviceSchema>) {
  const { name, description, categoryId } = data;

  await prisma.service.update({
    where: {
      id: id
    },
    data: {
      name,
      description,
      category: {
        connect: { id: parseInt(categoryId) }
      }
    },
  });

  revalidatePath("/services");
  redirect("/services");
}

export async function removeService(formData: FormData) {
  const id = formData.get("id")?.toString();

  if (!id) {
    return;
  }

  await prisma.service.delete({
    where: {
      id: parseInt(id),
    },
  });

  revalidatePath("/services");
}

export async function getServices() {
  return await prisma.service.findMany({
    include: { category: true },
  });
}

export async function getServiceById(id: number) {
  return await prisma.service.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function getCategories() {
  return await prisma.category.findMany();
}