"use client";
export default function ProductWarranty({ warranty }) {
  if (!warranty) return null;
  return (
    <div className="bg-white border border-border rounded-xl p-4 text-sm">
      <h3 className="font-semibold mb-2">Warranty</h3>
      <p className="text-muted-foreground">{warranty}</p>
    </div>
  );
}
