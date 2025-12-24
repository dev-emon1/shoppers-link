import { useMemo } from "react";
import { sortProducts } from "../utils/sortProducts";

export default function useSortedProducts(products, sort) {
  return useMemo(() => {
    return sortProducts(products, sort);
  }, [products, sort]);
}
