"use client";

import { useEffect } from "react";

export default function DynamicBackground() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    document.body.appendChild(canvas);

    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.zIndex = "-1";
    canvas.style.pointerEvents = "none";

    const colors = ["#7C3AED", "#3B82F6", "#06B6D4", "#F472B6"];
    let mouseX = 0.5, mouseY = 0.5;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    };
    window.addEventListener("mousemove", handleMouseMove);

    const handleGyro = (e: DeviceOrientationEvent) => {
      if (e.gamma && e.beta) {
        mouseX = (e.gamma + 90) / 180;
        mouseY = (e.beta + 90) / 180;
      }
    };
    window.addEventListener("deviceorientation", handleGyro);

    const draw = () => {
      const gradient = ctx.createRadialGradient(
        canvas.width * mouseX,
        canvas.height * mouseY,
        200,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width
      );
      colors.forEach((c, i) => gradient.addColorStop(i / (colors.length - 1), c));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("deviceorientation", handleGyro);
      document.body.removeChild(canvas);
    };
  }, []);

  return null;
}
