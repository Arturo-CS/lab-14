import { redirect } from "next/navigation";
import { FormUpdateImage } from "./form-update-image";
import { GetImage } from "@/actions/image-actions";

export default async function ImageUpdate({params}: {
  params: {
    id: string
  }
}) {
  const image = await GetImage(params.id);

  if (!image) {
    redirect("/images")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24 text-3xl font-bold">
      <FormUpdateImage image={image} id={params.id} />
    </div>
  );
}