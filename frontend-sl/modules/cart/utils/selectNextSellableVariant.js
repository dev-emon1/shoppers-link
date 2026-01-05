export function selectNextSellableVariant({
  variants = [],
  preferredVariantId = null,
  usedVariantIds = [],
}) {
  if (!Array.isArray(variants) || variants.length === 0) return null;

  // 1️⃣ User explicitly selected variant
  if (preferredVariantId) {
    const selected = variants.find(
      (v) => String(v.id) === String(preferredVariantId)
    );
    if (selected && Number(selected.stock) > 0) return selected;
  }

  // 2️⃣ All in-stock variants
  const inStockVariants = variants.filter((v) => Number(v.stock) > 0);

  if (inStockVariants.length === 0) return null;

  // 3️⃣ Pick unused variant (rotation)
  const unused = inStockVariants.find(
    (v) => !usedVariantIds.includes(String(v.id))
  );

  if (unused) return unused;

  // 4️⃣ All used once → restart rotation
  return inStockVariants[0];
}
