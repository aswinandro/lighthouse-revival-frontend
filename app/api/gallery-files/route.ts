export const runtime = "edge"
import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function GET() {
  try {
    const galleryDir = path.join(process.cwd(), "public/assets/gallery");
    const files = await fs.readdir(galleryDir);
    const images = files.filter((file) => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));
    return NextResponse.json({ images });
  } catch (err) {
    return NextResponse.json({ images: [] });
  }
}
