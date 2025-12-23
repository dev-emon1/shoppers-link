"use client";

import ListingHeader from "@/components/shared/ListingHeader/ListingHeader";

export default function ProductHeader({ title, breadcrumb = [] }) {
  return (
    <ListingHeader title={title} breadcrumb={breadcrumb} showControls={false} />
  );
}
