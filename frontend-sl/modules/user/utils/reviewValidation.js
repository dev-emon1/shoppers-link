export const MAX_TEXT_LENGTH = 1000;
export const MAX_IMAGES = 3;
export const MAX_VIDEOS = 1;
export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
export const MAX_VIDEO_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_VIDEO_DURATION = 60; // seconds

export function validateText(text) {
  if (text.length > MAX_TEXT_LENGTH) {
    return "Review text must be under 1000 characters.";
  }
  return null;
}

export function validateMedia(media) {
  const images = media.filter((m) => m.type === "image").length;
  const videos = media.filter((m) => m.type === "video").length;
  if (images > MAX_IMAGES) return "Maximum 3 images allowed.";
  if (videos > MAX_VIDEOS) return "Maximum 1 video allowed.";
  return null;
}

export async function validateVideoDuration(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      if (video.duration > MAX_VIDEO_DURATION) {
        resolve("Video must be under 60 seconds.");
      } else {
        resolve(null);
      }
    };
    video.onerror = () => resolve("Invalid video file.");
    video.src = URL.createObjectURL(file);
  });
}
