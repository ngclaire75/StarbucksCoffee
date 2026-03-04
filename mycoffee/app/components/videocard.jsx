"use client";
import { useRef, useState } from "react";

export default function VideoCard({ src }) {
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isHover, setIsHover] = useState(false);

  const toggleVideo = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPaused(false);
    } else {
      videoRef.current.pause();
      setIsPaused(true);
    }
  };

  return (
    <div className="pairings-card">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="pairings-video"
      />

      <button
        className="pause-icon"
        onClick={toggleVideo}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        style={{
          transform: isHover ? "scale(1.1)" : "scale(1)",
          backgroundColor: isHover
            ? "rgba(0, 0, 0, 0.2)"
            : "transparent",
          transition: "transform 0.2s ease, background-color 0.2s ease",
        }}
      >
        {isPaused ? "▶" : "||"}
      </button>
    </div>
  );
}