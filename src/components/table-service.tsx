"use client";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import { ButtonDelete } from "./button-delete";
import { removeService } from "@/actions/services-actions";

interface Service {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
  } | null;
}

interface ServiceTableProps {
  services: Service[];
}

export default function ServiceTable({ services }: ServiceTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const uniqueCategories = new Set(services.map(service => service.category?.id));
    return Array.from(uniqueCategories).map(categoryId => {
      const service = services.find(s => s.category?.id === categoryId);
      return service?.category;
    }).filter(Boolean);
  }, [services]);

  const filteredServices = useMemo(() => {
    if (selectedCategory === "all" || !selectedCategory) return services;
    return services.filter(service => service.category?.id.toString() === selectedCategory);
  }, [services, selectedCategory]);

  return (
    <>
      <div className="mb-4">
        <Select onValueChange={setSelectedCategory} value={selectedCategory || "all"}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category!.id} value={category!.id.toString()}>
                {category!.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableCaption>Lista de servicios</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Nombre del servicio</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Operaciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredServices.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium">{service.id}</TableCell>
              <TableCell>{service.name}</TableCell>
              <TableCell>{service.description}</TableCell>
              <TableCell>{service.category?.name || 'Sin categoría'}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Link href={`/services/update/${service.id}`}>
                    <Button variant="outline">
                      <FaEdit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <ButtonDelete nPerCode={service.id} functionRemove={removeService} label="id" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}