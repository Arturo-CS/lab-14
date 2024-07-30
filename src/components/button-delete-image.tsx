import { Button } from "./ui/button";
import { FaTrash } from "react-icons/fa";
import { removeImage } from "@/actions/image-actions";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface PropsDeleteImageButton {
  id: string;
}

export function ButtonDeleteImage({ id }: PropsDeleteImageButton) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = () => {
    const formData = new FormData();
    formData.append('id', id);
    
    startTransition(async () => {
        try {
            const result = await removeImage(formData);
            if (result.success) {
                toast.success("Imagen eliminada exitosamente");
                router.refresh(); // Refrescar la página para reflejar los cambios
            } else {
                toast.error(result.error || "Error al eliminar la imagen");
            }
        } catch (error) {
            console.error("Error al eliminar la imagen:", error);
            toast.error("Error al eliminar la imagen");
        }
    });
  };

  return (
    <Button 
      variant="destructive" 
      size="sm" 
      onClick={handleDelete}
      disabled={isPending}
    >
      <FaTrash className="mr-2" />
      {isPending ? "Eliminando..." : "Eliminar"}
    </Button>
  );
}