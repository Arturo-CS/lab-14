"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { UpdateImage } from "@/actions/image-actions";
import { updateImageSchema } from "@/validations/imageSchema";
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";

type ImageFormData = z.infer<typeof updateImageSchema>;

interface FormUpdateImageProps {
    image: {
        name: string;
        imageUrl: string;
    };
    id: string;
}

export function FormUpdateImage({ image, id }: FormUpdateImageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(image.imageUrl);
  const form = useForm<ImageFormData>({
    resolver: zodResolver(updateImageSchema),
    defaultValues: {
        name: image.name,
    }
  });

  const onSubmit: SubmitHandler<ImageFormData> = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('id', id);
    formData.append('name', data.name);
    if (data.imageFile) {
        formData.append('imageFile', data.imageFile);
    }
    
    try {
        const result = await UpdateImage(formData);
        if (result.success) {
            toast.success("Imagen actualizada exitosamente");
            router.push('/images');
        } else {
            toast.error(result.error || "Error al actualizar la imagen");
        }
    } catch (error) {
        console.error("Error al actualizar la imagen:", error);
        toast.error("Error al actualizar la imagen");
    } finally {
        setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('imageFile', file);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-screen w-full m-auto flex-col">
        <Card className="max-w-4xl m-auto">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Actualizar Imagen</CardTitle>
            <CardDescription>
              Actualiza la información de la imagen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              <div className="mb-4">
                <Image
                  src={previewImage}
                  alt="Vista previa de la imagen"
                  width={300}
                  height={300}
                  className="rounded-lg object-cover"
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la imagen</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageFile"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Archivo de imagen (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        disabled={isLoading}
                        {...rest}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex w-full">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Actualizar Imagen'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}