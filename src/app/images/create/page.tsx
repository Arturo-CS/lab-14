import { ImageUploadForm } from "./form-image-upload";

export default function ImageUpload() {
    return (
      <div className="flex min-h-screen flex-col items-center justify-between text-3xl font-bold">
        <ImageUploadForm />
      </div>
    );
}