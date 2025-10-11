import fs from "fs/promises";
import path from "path";
import GalleryClient from "./GalleryClient";

export default async function GalleryPage() {
  const galleryDir = path.join(process.cwd(), "public/assets/gallery");
  const files = await fs.readdir(galleryDir);
  const images = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
  return <GalleryClient images={images} />;
}