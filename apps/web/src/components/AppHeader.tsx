"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

const steps = [
  { label: "Upload", path: "/dashboard/upload" },
  { label: "Review", path: "/dashboard/review" },
  { label: "Train", path: "/dashboard/train" },
  { label: "Results", path: "/dashboard/results" },
];

export default function AppHeader() {
  const pathname = usePathname();

  const currentIndex = steps.findIndex((step) => step.path === pathname);

  return (
    <header className="w-full border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-5">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Foresight ML"
              width={100}
              height={100}
              priority
            />

            <div className="flex flex-col">
              <div className="flex">
                <h1 className="text-xl font-semibold text-white">
                  Foresight ML
                </h1>
              </div>
              <div>
                <p className="text-sm text-neutral-400">
                  Machine learning experiments without writing code.
                </p>
              </div>
            </div>
            </div>
          </div>

          <nav className="flex items-center gap-3">
            {steps.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = index === currentIndex;
              const isComplete = index < currentIndex;

              return (
                <div key={step.path} className="flex items-center gap-3">
                  <div
                    className={[
                      "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                      isComplete
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-blue-600 text-white"
                          : "bg-neutral-800 text-neutral-400",
                    ].join(" ")}
                  >
                    {isComplete ? "✓" : stepNumber}
                  </div>

                  <span
                    className={
                      isActive
                        ? "text-sm font-medium text-white"
                        : "text-sm text-neutral-500"
                    }
                  >
                    {step.label}
                  </span>

                  {index < steps.length - 1 && (
                    <div className="h-px w-8 bg-neutral-700" />
                  )}
                </div>
              );
            })}
          </nav>

          <button className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-900">
            Settings
          </button>
        </div>
    </header>
  );
}