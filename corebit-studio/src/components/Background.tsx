"use client";

import { useEffect } from "react";

export default function Background() {
  useEffect(() => {
    const gradient = document.createElement("div");
    gradient.style.position = "fixed";
    gradient.style.top = "0";
    gradient.style.left = "0";
    gradient.style.width = "100%";
    gradient.style.height = "100%";
    gradient.style.zIndex = "-1";
    gradient.style.background = "linear-gradient(120deg, #7C3AED, #3B82F6, #06B6D4, #F472B6)";
    gradient.style.backgroundSize = "600% 600%";
    gradient.style.animation = "gradientFlow 20s ease infinite";
    document.body.appendChild(gradient);

    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes gradientFlow {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);

    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      gradient.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeChild(gradient);
      document.head.removeChild(style);
    };
  }, []);

  return null;
}
