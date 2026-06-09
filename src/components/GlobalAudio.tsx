"use client";

import { useEffect, useRef, useState } from "react";
import { useAudioStore } from "@/store/useAudioStore";

export default function GlobalAudio() {
  const { isPlaying } = useAudioStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !audioRef.current) return;

    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          // Playback was prevented (e.g. autoplay restriction)
          console.log("Autoplay blocked, waiting for user interaction:", error);
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, mounted]);

  useEffect(() => {
    if (!mounted) return;

    const handleUserInteraction = () => {
      if (isPlaying && audioRef.current) {
        audioRef.current.play()
          .then(() => {
            console.log("Audio started successfully via user interaction");
            removeListeners();
          })
          .catch((err) => {
            console.log("Play failed on interaction:", err);
          });
      }
    };

    const removeListeners = () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
      window.removeEventListener("mousedown", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);
    window.addEventListener("keydown", handleUserInteraction);
    window.addEventListener("mousedown", handleUserInteraction);

    return () => {
      removeListeners();
    };
  }, [mounted, isPlaying]);

  if (!mounted) return null;

  return (
    <audio 
      ref={audioRef}
      src="/bgm.mp3" 
      loop 
      preload="auto"
    />
  );
}
