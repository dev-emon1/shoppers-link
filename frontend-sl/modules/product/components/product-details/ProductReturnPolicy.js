"use client";
export default function ProductReturnPolicy({ returnPolicy }) {
  if (!returnPolicy) return null;
  return (
    <div className="bg-white border border-border rounded-xl p-4 text-sm">
      <h3 className="font-semibold mb-2">Return Policy</h3>
      <p className="text-muted-foreground">{returnPolicy}</p>
    </div>
  );
}
