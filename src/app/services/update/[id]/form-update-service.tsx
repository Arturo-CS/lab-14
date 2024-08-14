"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateService } from "@/actions/services-actions";
import { getCategories } from "@/actions/category-actions";
import { serviceUpdateSchema } from "@/validations/serviceSchema";
import type { ServiceUpdate } from "@/validations/serviceSchema";

interface Category {
  id: number;
  name: string;
}

interface FormUpdateServiceProps {
  service: ServiceUpdate;
}

function FormUpdateService({ service }: FormUpdateServiceProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setIsLoadingCategories(true);
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  const form = useForm<ServiceUpdate>({
    resolver: zodResolver(serviceUpdateSchema),
    defaultValues: {
      id: service.id,
      name: service.name,
      description: service.description,
      categoryId: service.categoryId,
      category: service.category,
    }
  });

  const onSubmit = async (data: ServiceUpdate) => {
    try {
      await updateService(data.id, data);
      console.log("Servicio actualizado correctamente");
    } catch (error) {
      console.error("Error al actualizar el servicio:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl mb-4">Actualizar Servicio</CardTitle>
            <CardDescription>
              Actualiza la información del servicio.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Servicio</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del Servicio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descripción del servicio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(value === "null" ? null : Number(value))} 
                    value={field.value?.toString() ?? "null"}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCategories ? (
                        <SelectItem value="loading">Cargando categorías...</SelectItem>
                      ) : (
                        <>
                          <SelectItem value="null">Sin categoría</SelectItem>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Actualizar Servicio</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default FormUpdateService;