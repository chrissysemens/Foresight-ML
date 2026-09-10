import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";

import { profileDataset } from "@predict-flow/core";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file uploaded." },
      { status: 400 }
    );
  }

  const bytes = await file.arrayBuffer();

  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "uploads");

  await fs.mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, file.name);

  await fs.writeFile(filePath, buffer);

  const profile = await profileDataset(filePath);

  return NextResponse.json({
    ...profile,
    fileName: file.name,
  });
}