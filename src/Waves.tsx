import { useEffect, useRef } from "react";

type Layer = {
  base: number; // vertical position, 0 top to 1 bottom
  amp: number; // wave height as a fraction of the screen
  freq: number; // number of waves across the screen
  speed: number; // cycles per second, negative moves the other way
  phase: number;
  rgb: string;
  alpha: number;
};

const layers: Layer[] = [
  { base: 0.5, amp: 0.07, freq: 1.1, speed: 0.03, phase: 0, rgb: "108, 90, 220", alpha: 0.2 },
  { base: 0.6, amp: 0.08, freq: 0.9, speed: -0.025, phase: 2, rgb: "66, 106, 226", alpha: 0.2 },
  { base: 0.7, amp: 0.06, freq: 1.5, speed: 0.04, phase: 4, rgb: "140, 112, 240", alpha: 0.16 },
  { base: 0.8, amp: 0.05, freq: 1.9, speed: -0.05, phase: 1, rgb: "90, 130, 240", alpha: 0.14 },
];

const TAU = Math.PI * 2;
const STEP = 8;

function waveY(layer: Layer, u: number, t: number, h: number): number {
  const a = Math.sin(u * layer.freq * TAU + t * layer.speed * TAU + layer.phase);
  const b = Math.sin(u * layer.freq * 1.7 * TAU - t * layer.speed * 0.7 * TAU + layer.phase * 1.7);
  return h * (layer.base + layer.amp * (a + 0.45 * b));
}

export default function Waves() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let w = 0;
    let h = 0;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const layer of layers) {
        const top = h * (layer.base - layer.amp * 1.5);
        const fill = ctx.createLinearGradient(0, top, 0, h);
        fill.addColorStop(0, `rgba(${layer.rgb}, ${layer.alpha})`);
        fill.addColorStop(1, `rgba(${layer.rgb}, ${layer.alpha * 0.2})`);

        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w + STEP; x += STEP) {
          ctx.lineTo(x, waveY(layer, x / w, t, h));
        }
        ctx.lineTo(w + STEP, h);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();

        ctx.beginPath();
        for (let x = 0; x <= w + STEP; x += STEP) {
          const y = waveY(layer, x / w, t, h);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(${layer.rgb}, ${Math.min(layer.alpha * 2.2, 0.5)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = (now: number) => {
      draw(now / 1000);
      frame = requestAnimationFrame(loop);
    };

    resize();
    if (reduced) {
      draw(0);
    } else {
      frame = requestAnimationFrame(loop);
    }

    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="waves" aria-hidden="true" />;
}
