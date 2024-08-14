import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ServiceTable from "@/components/table-service";

export default async function Services() {
  const services = await prisma.service.findMany({
    include: { category: true },
  });

  return (
    <div>
      <div className="flex justify-end items-center pt-16">
        <Link href="/services/create">
          <Button>
            Registrar servicio
          </Button>
        </Link>
      </div>
      <div className="flex min-h-screen flex-col items-center pb-24 ">
        <h1 className="text-3xl font-bold mb-10">Servicios</h1>
        <ServiceTable services={services} />
      </div>
    </div>
  );
}