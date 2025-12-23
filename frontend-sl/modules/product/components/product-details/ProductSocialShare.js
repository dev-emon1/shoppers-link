"use client";
import { Facebook, Twitter, Link as LinkIcon, Share2 } from "lucide-react";

export default function ProductSocialShare({ product }) {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => navigator.clipboard?.writeText?.(shareUrl);

  return (
    <div className="bg-white border border-border  p-4 text-sm">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Share2 size={16} /> Share This Product
      </h3>
      <div className="flex gap-3">
        <a
          href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 flex items-center gap-1 hover:underline"
        >
          <Facebook size={14} /> Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 flex items-center gap-1 hover:underline"
        >
          <Twitter size={14} /> Twitter
        </a>
        <button
          onClick={copyLink}
          className="flex items-center gap-1 text-gray-500 hover:text-primary"
        >
          <LinkIcon size={14} /> Copy Link
        </button>
      </div>
    </div>
  );
}
