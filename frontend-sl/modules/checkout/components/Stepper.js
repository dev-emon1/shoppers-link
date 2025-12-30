"use client";

import { CheckCircle2 } from "lucide-react";
import { steps } from "../hooks/useCheckoutSteps";

export default function Stepper({ active }) {
  return (
    <ol className="flex flex-wrap items-center gap-4 md:gap-8 mb-4 overflow-x-auto">
      {steps.map((step, index) => {
        const isCompleted = active > index + 1;
        const isActive = active === index + 1;

        return (
          <li
            key={step.id}
            className="flex items-center gap-3 text-sm min-w-max"
          >
            <div
              className={[
                "p-1 rounded-full text-xs font-semibold leading-none border flex-shrink-0",
                isCompleted
                  ? "bg-green border-green text-white"
                  : isActive
                  ? "bg-main/10 border-main text-main px-2 "
                  : "bg-white border-border text-textSecondary px-2",
              ].join(" ")}
            >
              {isCompleted ? <CheckCircle2 size={16} /> : step.id}
            </div>

            <span
              className={[
                "font-medium",
                isActive
                  ? "text-main"
                  : isCompleted
                  ? "text-green"
                  : "text-textSecondary",
              ].join(" ")}
            >
              {step.label}
            </span>

            {index < steps.length - 1 && (
              <span className="hidden md:inline-block h-px w-10 bg-border" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
