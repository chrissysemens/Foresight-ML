"use client";

import { useState } from "react";

type UploadCardProps = {
    onUpload(file: File): void;
};

export function UploadCard({ onUpload }: UploadCardProps) {
    const [isDragging, setIsDragging] = useState(false);
    return (
        <section
            className={`rounded-xl border-2 p-8 transition-colors ${isDragging
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-white/20"
                }`}
            onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
            }}
            onDrop={(event) => {
                event.preventDefault();

                const file = event.dataTransfer.files?.[0];

                if (file) {
                    onUpload(file);
                }
                setIsDragging(false);

            }}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
        >
            <p className="mb-4 text-lg">Upload a CSV to begin.</p>

            <input
                type="file"
                accept=".csv"
                onChange={(event) => {
                    const file = event.target.files?.[0];

                    if (file) {
                        onUpload(file);
                    }
                }}
            />
        </section>
    );
}