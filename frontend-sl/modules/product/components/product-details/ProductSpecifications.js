"use client";
export default function ProductSpecifications({ specs = [] }) {
  if (!Array.isArray(specs) || specs.length === 0) return null;
  return (
    <div className="bg-white border border-border rounded-xl p-4">
      <h3 className="text-lg font-semibold mb-3">Specifications</h3>
      <ul className="divide-y divide-border">
        {specs.map((s, i) => (
          <li key={i} className="flex justify-between p-3 text-sm">
            <span className="font-medium text-foreground">{s.key}</span>
            <span className="text-muted-foreground">{s.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
