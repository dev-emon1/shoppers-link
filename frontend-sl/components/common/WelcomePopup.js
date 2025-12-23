"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "welcome_popup_dismissed_v2";

export default function WelcomePopup() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef(null);

  //
  // INITIAL MOUNT
  //
  useEffect(() => {
    setMounted(true);
  }, []);

  //
  // Check if popup dismissed already
  //
  useEffect(() => {
    if (!mounted) return;

    const dismissed = sessionStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setShow(true);
    }
  }, [mounted]);

  //
  // Disable scroll when popup visible
  //
  useEffect(() => {
    document.body.style.overflow = show ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  //
  // Close popup
  //
  function handleClose() {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }

  //
  // TOGGLE SOUND
  //
  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;

    if (muted) {
      // Fade-in sound
      video.muted = false;
      video.volume = 0;
      let v = 0;
      const fadeIn = setInterval(() => {
        v += 0.05;
        if (v >= 1) {
          video.volume = 1;
          clearInterval(fadeIn);
        } else {
          video.volume = v;
        }
      }, 60);
    } else {
      video.muted = true;
    }

    setMuted(!muted);
  }

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center px-3 sm:px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 sm:top-5 sm:right-5 text-white hover:scale-110 transition-transform z-[1002]"
          >
            <X size={28} />
          </button>

          {/* Popup Box */}
          <motion.div
            className="relative w-[90%] sm:w-[85%] md:w-[75%] lg:w-[70%] xl:w-[50%] rounded-3xl overflow-hidden bg-black shadow-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            {/* INTRO VIDEO */}
            <motion.video
              ref={videoRef}
              src="/intro.mp4"
              autoPlay
              muted={muted}
              loop={false} // MUST be off
              playsInline
              onEnded={handleClose} // CLOSE WHEN VIDEO FINISHES
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            />

            {/* SOUND BUTTON */}
            <button
              onClick={toggleSound}
              className="absolute bottom-5 right-5 z-[1003] bg-white/70 backdrop-blur-md p-3 rounded-full shadow-lg hover:scale-110 transition"
            >
              {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
