"use client";
import React, { useState } from "react";
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
import { CreateImage } from "@/actions/image-actions";
import { createImageSchema } from "@/validations/imageSchema";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react"; // Asegúrate de tener instalado lucide-react

type ImageFormData = z.infer<typeof createImageSchema>;

export function ImageUploadForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ImageFormData>({
    resolver: zodResolver(createImageSchema),
  });

  const onSubmit: SubmitHandler<ImageFormData> = async (data) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('imageFile', data.imageFile);
    
    try {
        const result = await CreateImage(formData);
        if (result.success) {
            toast.success("Imagen subida exitosamente");
            form.reset();
            router.push('/images');
        } else {
            toast.error(result.error || "Error al subir la imagen");
        }
    } catch (error) {
        toast.error("Error al subir la imagen");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex min-h-screen w-full m-auto flex-col">
        <Card className="max-w-4xl m-auto">
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Subir Imagen</CardTitle>
            <CardDescription>
              Sube una nueva imagen a la galería.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
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
                    <FormLabel>Archivo de imagen</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            onChange(file);
                          }
                        }}
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
                  Subiendo...
                </>
              ) : (
                'Subir Imagen'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}