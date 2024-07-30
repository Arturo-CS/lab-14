import { Button } from "@/components/ui/button";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ImageGallery from "@/components/image-gallery";

export default async function Images() {
  const images = await prisma.image.findMany();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Imágenes</h1>
        <Link href="/images/create">
          <Button>
            Subir Imagen
          </Button>
        </Link>
      </div>
      <ImageGallery images={images} />
    </div>
  );
}