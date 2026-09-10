import { NextRequest, NextResponse } from "next/server";
import { predict } from "@predict-flow/ml";
import path from "node:path";
import { promises as fs } from "node:fs";

export async function POST(request: NextRequest) {
    const formData = await request.formData();

    const file = formData.get("file");
    const modelDirectory = formData.get("modelDirectory");

    if (!(file instanceof File) || typeof modelDirectory !== "string") {
        return NextResponse.json(
            { error: "Missing file or modelDirectory." },
            { status: 400 }
        );
    }

    const uploadDir = path.join(process.cwd(), "uploads", "predictions");
    await fs.mkdir(uploadDir, { recursive: true });

    const inputPath = path.join(uploadDir, file.name);
    const outputPath = path.join(
        process.cwd(),
        "output",
        `predictions-${Date.now()}.csv`
    );

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(inputPath, buffer);

    const result = await predict({
        csvPath: inputPath,
        modelDirectory,
        outputPath,
    });

    return NextResponse.json(result);
}