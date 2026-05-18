import { useEffect, useRef } from "react";

type Star = {
  angle: number;
  color: string;
  radius: number;
  speed: number;
  width: number;
  z: number;
};

export default function HyperspaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const stars: Star[] = [];
    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let centerX = 0;
    let centerY = 0;
    let lastTime = performance.now();
    let starCount = 0;

    const resetStar = (star: Star, initial = false) => {
      star.angle = Math.random() * Math.PI * 2;
      star.radius = Math.pow(Math.random(), 0.42) * 1.08 + 0.02;
      star.z = initial ? Math.random() * 0.95 + 0.05 : 1;
      star.speed = Math.random() * 0.00034 + 0.00042;
      star.width = Math.random() * 1.8 + 0.7;
      star.color =
        Math.random() > 0.28
          ? "rgba(238, 246, 255, 0.95)"
          : "rgba(135, 178, 255, 0.88)";
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      starCount = Math.min(
        460,
        Math.max(220, Math.floor((width * height) / 4200)),
      );

      while (stars.length < starCount) {
        const star = {} as Star;
        resetStar(star, true);
        stars.push(star);
      }

      stars.length = starCount;
    };

    const project = (star: Star, z: number) => {
      const distance = Math.max(z, 0.018);
      const tunnelRadius = Math.max(width, height) * 0.58 * star.radius;
      const scale = 1 / distance;

      return {
        x: centerX + Math.cos(star.angle) * tunnelRadius * scale,
        y: centerY + Math.sin(star.angle) * tunnelRadius * scale,
      };
    };

    const drawBackground = () => {
      context.fillStyle = "#010102";
      context.fillRect(0, 0, width, height);

      const glow = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        Math.max(width, height) * 0.72,
      );
      glow.addColorStop(0, "rgba(8, 12, 28, 0.96)");
      glow.addColorStop(0.18, "rgba(3, 5, 15, 0.9)");
      glow.addColorStop(0.48, "rgba(1, 1, 8, 0.98)");
      glow.addColorStop(1, "rgba(0, 0, 0, 1)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);
    };

    const draw = (time: number) => {
      const delta = Math.min(time - lastTime, 32);
      lastTime = time;

      drawBackground();

      context.save();
      context.globalCompositeOperation = "lighter";

      for (const star of stars) {
        if (!reducedMotion) {
          star.z -= star.speed * delta;
        }

        if (star.z <= 0.018) {
          resetStar(star);
        }

        const current = project(star, star.z);
        const tail = project(star, star.z + (reducedMotion ? 0.02 : 0.13));

        if (
          current.x < -200 ||
          current.x > width + 200 ||
          current.y < -200 ||
          current.y > height + 200
        ) {
          resetStar(star);
          continue;
        }

        const opacity = Math.min(1, Math.max(0.16, 1.08 - star.z));
        const lineGradient = context.createLinearGradient(
          tail.x,
          tail.y,
          current.x,
          current.y,
        );
        lineGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        lineGradient.addColorStop(0.38, star.color.replace("0.95", "0.38"));
        lineGradient.addColorStop(1, star.color);

        context.strokeStyle = lineGradient;
        context.globalAlpha = opacity;
        context.lineWidth = star.width * Math.min(2.9, 0.8 / star.z);
        context.beginPath();
        context.moveTo(tail.x, tail.y);
        context.lineTo(current.x, current.y);
        context.stroke();
      }

      context.restore();

      const vignette = context.createRadialGradient(
        centerX,
        centerY,
        Math.min(width, height) * 0.1,
        centerX,
        centerY,
        Math.max(width, height) * 0.72,
      );
      vignette.addColorStop(0, "rgba(0, 0, 0, 0.46)");
      vignette.addColorStop(0.5, "rgba(0, 0, 0, 0.08)");
      vignette.addColorStop(1, "rgba(0, 0, 0, 0.82)");
      context.fillStyle = vignette;
      context.fillRect(0, 0, width, height);

      if (!reducedMotion) {
        animationFrame = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    animationFrame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
