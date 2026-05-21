import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  _: NextRequest,
  { params }: { params: { filename: string } },
) {
  const filename = params.filename;

  // Define your absolute local path
  const baseDirectory =
    "D:\\DataServer\\Idari Ishler\\Vusal Abdullayev\\backup\\KART\\Images";
  const filePath = path.join(baseDirectory, filename);

  // Security check: Ensure the user isn't trying to escape the directory (e.g., ../../../etc)
  if (!filePath.startsWith(baseDirectory)) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  try {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse("Image Not Found", { status: 404 });
    }

    // Read the file and return it
    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/jpeg", // Adjust dynamically if you have png/webp
      },
    });
  } catch (error) {
    if (error instanceof Error) console.log({ error: error.message });
    return new NextResponse("Error loading image", { status: 500 });
  }
}
