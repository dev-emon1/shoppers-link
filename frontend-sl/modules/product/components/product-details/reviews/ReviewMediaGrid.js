"use client";

import Image from "next/image"; // Import Next Image

const ReviewMediaGrid = ({ images = [], video, onClick }) => {
  // Convert video to string if it's an object (Next.js static import)
  const videoUrl = video
    ? typeof video === "string"
      ? video
      : video.src || ""
    : "";

  const mediaList = videoUrl
    ? [videoUrl, ...images.slice(0, 3)]
    : images.slice(0, 4);

  const isVideo = (media) => {
    if (typeof media !== "string") return false;
    return (
      media.endsWith(".mp4") ||
      media.endsWith(".webm") ||
      media.includes("video") ||
      media.includes(".mp4")
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {mediaList.map((media, i) => (
        <button
          key={i}
          onClick={() => onClick(media)}
          className="relative w-20 h-20 rounded-lg overflow-hidden ring-1 ring-border hover:ring-main transition-shadow hover:shadow-md"
        >
          {isVideo(media) ? (
            <>
              <video
                src={media}
                className="w-full h-full object-cover"
                muted
                loop
                playsInline
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </>
          ) : (
            <Image
              src={media} // Works for static import or URL
              alt="Review image"
              fill // Fills the container
              className="object-cover hover:scale-110 transition duration-300"
              sizes="80px" // Optimized size
              quality={75} // Balance quality/performance
              loading="lazy" // Lazy load
            />
          )}

          {i === 3 && images.length > 4 && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                +{images.length - 3}
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

export default ReviewMediaGrid;
