// components/image-gallery.tsx

"use client";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaEdit, FaExpand, FaTimes } from "react-icons/fa";
import { ButtonDeleteImage } from "@/components/button-delete-image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageItem {
  id: string;
  name: string;
  imageUrl: string;
}

interface ImageGalleryProps {
  images: ImageItem[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <motion.div
            key={image.id}
            className="relative group overflow-hidden rounded-lg shadow-lg"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={image.imageUrl}
              alt={image.name}
              width={400}
              height={400}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
              <h3 className="text-white text-lg font-semibold mb-2 text-center">{image.name}</h3>
              <div className="flex space-x-2">
                <Link href={`/images/update/${image.id}`}>
                  <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200">
                    <FaEdit className="mr-2" /> Editar
                  </Button>
                </Link>
                <ButtonDeleteImage id={image.id} />
                <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200" onClick={() => setSelectedImage(image)}>
                  <FaExpand className="mr-2" /> Expandir
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={selectedImage.imageUrl}
                alt={selectedImage.name}
                width={800}
                height={800}
                className="max-w-full max-h-[90vh] object-contain"
              />
              <Button
                variant="outline"
                size="sm"
                className="absolute top-4 right-4 bg-white text-black hover:bg-gray-200"
                onClick={() => setSelectedImage(null)}
              >
                <FaTimes />
              </Button>
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                <h3 className="text-xl font-semibold mb-2">{selectedImage.name}</h3>
                <div className="flex justify-center space-x-2">
                  <Link href={`/images/update/${selectedImage.id}`}>
                    <Button variant="outline" size="sm" className="bg-white text-black hover:bg-gray-200">
                      <FaEdit className="mr-2" /> Editar
                    </Button>
                  </Link>
                  <ButtonDeleteImage id={selectedImage.id} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}