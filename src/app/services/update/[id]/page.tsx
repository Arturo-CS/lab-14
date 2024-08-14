import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import FormUpdateService from "./form-update-service";
import type { ServiceUpdate } from "@/validations/serviceSchema";

export default async function UpdateServicePage({params}: {
  params: {
    id: string
  }
}) {
  const id = parseInt(params.id);
  const service = await prisma.service.findFirst({
    where: {
      id: id
    },
    include: {
      category: true
    }
  });

  if (!service) {
    redirect("/services");
  }

  const serviceData: ServiceUpdate = {
    id: service.id,
    name: service.name,
    description: service.description,
    categoryId: service.categoryId,
    category: service.category
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 text-3xl font-bold">
      <FormUpdateService service={serviceData} />
    </div>
  );
}