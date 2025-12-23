"use client";

export default function EmptyState({ title, description }) {
  return (
    <div className="py-24 text-center">
      <h3 className="text-xl font-semibold text-textPrimary">{title}</h3>

      {description && (
        <p className="mt-2 text-textLight max-w-md mx-auto">{description}</p>
      )}
    </div>
  );
}
