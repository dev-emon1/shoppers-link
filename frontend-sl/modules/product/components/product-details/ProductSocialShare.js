"use client";
import { useState } from "react"; // Added useState
import { Facebook, Twitter, Link as LinkIcon, Share2, Check } from "lucide-react"; // Added Check icon

export default function ProductSocialShare({ product }) {
  const [copied, setCopied] = useState(false); // State to handle the message
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const copyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        // Reset the message after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <div className="bg-white border border-border p-4 text-sm">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Share2 size={16} /> Share This Product
      </h3>
      <div className="flex gap-4 items-center">
        <a
          href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 flex items-center gap-1 hover:underline"
        >
          <Facebook size={14} /> Facebook
        </a>
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 flex items-center gap-1 hover:underline"
        >
          <Twitter size={14} /> Twitter
        </a>

        <button
          onClick={copyLink}
          disabled={copied}
          className={`flex items-center gap-1 transition-colors duration-200 ${copied ? "text-green-600 font-medium" : "text-gray-500 hover:text-primary"
            }`}
        >
          {copied ? (
            <>
              <Check size={14} /> Copied!
            </>
          ) : (
            <>
              <LinkIcon size={14} /> Copy Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}