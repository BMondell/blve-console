"use client";

import { useEffect, useRef } from "react";

export default function HeroGraph() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    let t = 0;

    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      ctx.clearRect(0, 0, w, h);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(0, 140, 255, 0.9)";

      for (let x = 0; x < w; x++) {
        const y =
          h / 2 +
          Math.sin((x + t) * 0.02) * 18 +
          Math.sin((x + t) * 0.008) * 12;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      t += 1.5;

      requestAnimationFrame(render);
    };

    render();

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <div className="w-full h-40 rounded-lg bg-[#0A0D12] border border-white/5 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
