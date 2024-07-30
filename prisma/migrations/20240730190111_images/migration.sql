-- CreateTable
CREATE TABLE "Image" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);
