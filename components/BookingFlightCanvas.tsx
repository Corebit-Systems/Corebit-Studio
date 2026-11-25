'use client';

import { useEffect, useRef } from 'react';

type Point = [x: number, y: number];

const frame: Point[] = [
  [-1.85, -0.70], [-1.49, -1.06], [1.49, -1.06], [1.85, -0.70],
  [1.85, 0.70], [1.49, 1.06], [-1.49, 1.06], [-1.85, 0.70],
];
const travelPerStage = 3.8;

function trace(ctx: CanvasRenderingContext2D, points: Point[], closed = false) {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(...points[i]);
  if (closed) ctx.closePath();
}

function drawPacket(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
  const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 2.65);
  glow.addColorStop(0, '#50ffc961');
  glow.addColorStop(.34, '#18e9a031');
  glow.addColorStop(1, '#10b98100');
  ctx.fillStyle = glow;
  ctx.fillRect(x - size * 2.65, y - size * 2.65, size * 5.3, size * 5.3);

  const rotation = time * .48;
  const orbit = Array.from({ length: 4 }, (_, i) => {
    const angle = rotation + i * Math.PI / 2;
    return { x: Math.cos(angle), z: Math.sin(angle) };
  });
  const top: Point[] = orbit.map(p => [x + p.x * size, y + p.z * size * .32 - size * .36]);
  const bottom: Point[] = top.map(([px, py]) => [px, py + size * .76]);

  const faces = orbit.map((point, index) => ({
    index,
    depth: point.z + orbit[(index + 1) % orbit.length].z,
  })).sort((a, b) => a.depth - b.depth);
  const faceFill = ctx.createLinearGradient(x, y - size, x, y + size);
  faceFill.addColorStop(0, '#5dffd8be');
  faceFill.addColorStop(1, '#064e3fda');
  ctx.strokeStyle = '#b0ffe6';
  ctx.lineWidth = 1.25;
  for (const { index, depth } of faces) {
    if (depth < 0) continue;
    const next = (index + 1) % orbit.length;
    trace(ctx, [top[index], top[next], bottom[next], bottom[index]], true);
    ctx.fillStyle = faceFill;
    ctx.fill();
    ctx.stroke();
  }
  trace(ctx, top, true);
  ctx.fillStyle = '#45ccaa99';
  ctx.fill();
  ctx.stroke();
  trace(ctx, top.map(([px, py]): Point => [x + (px - x) * .57, y - size * .36 + (py - y + size * .36) * .57]), true);
  ctx.strokeStyle = '#e0fff4';
  ctx.stroke();
}

function paint(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  camera: number,
  time: number,
  lean: Point,
) {
  ctx.clearRect(0, 0, width, height);
  const centerX = width * (.5 + lean[0] * .065);
  const centerY = height * (.49 + lean[1] * .09);
  const focal = Math.min(width * .63, height * 1.08);
  const near = Math.floor(camera) + 1;

  function ringAt(world: number, radius = 1): Point[] {
    const depth = world - camera;
    const scale = focal / (depth + .68);
    const angle = Math.sin(world * .32) * .24 + camera * .045 + lean[0] * .13;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const curve = Math.sin(world * .34 + .64) - Math.sin(camera * .34 + .64);
    return frame.map(([x, y]) => [
      centerX + ((x * cos - y * sin) * radius + curve * .42) * scale,
      centerY + ((x * sin + y * cos) * radius + curve * .17) * scale,
    ]);
  }

  const rings = Array.from({ length: 23 }, (_, index) => ringAt(near + index));
  for (const index of [0, 1, 2, 3, 4, 5, 6, 7]) {
    trace(ctx, rings.map(ring => ring[index]));
    ctx.strokeStyle = index % 2 ? '#67f3c03f' : '#3edca925';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  for (let i = rings.length - 1; i >= 0; i--) {
    const world = near + i;
    const alpha = Math.max(0, .72 - i * .025);
    const main = world % 3 === 0;
    trace(ctx, rings[i], true);
    ctx.strokeStyle = main ? `rgba(132, 255, 214, ${alpha})` : `rgba(46, 229, 171, ${alpha * .42})`;
    ctx.lineWidth = main ? 1.65 : .8;
    ctx.stroke();
    if (main) {
      trace(ctx, ringAt(world, 1.055), true);
      ctx.strokeStyle = `rgba(70, 234, 181, ${alpha * .32})`;
      ctx.lineWidth = .8;
      ctx.stroke();
      trace(ctx, rings[i], true);
      ctx.strokeStyle = `rgba(57, 249, 187, ${alpha * .16})`;
      ctx.lineWidth = i < 6 ? 7 : 3;
      ctx.stroke();
    }
  }

  for (let i = 0; i < 60; i++) {
    const depth = (i * 3.713 + 42 - (camera + time * .65) % 42) % 42 + .65;
    const angle = i * 2.39996;
    const distance = 1.1 + i % 8 * .24;
    const scale = focal / (depth + .4);
    const px = centerX + Math.cos(angle) * distance * scale;
    const py = centerY + Math.sin(angle) * distance * scale * .72;
    ctx.fillStyle = i % 7 ? '#6ee7b79c' : '#c7fff0';
    ctx.fillRect(px, py, Math.min(2, scale * .018), Math.min(2, scale * .02));
  }

  for (const [index, corner] of [1, 3, 5, 7].entries()) {
    const distance = 14 - (time * (2.6 + index * .17) + index * 3.7) % 12;
    const points = Array.from({ length: 7 }, (_, segment) =>
      ringAt(camera + distance + segment * .21)[corner]);
    const lead = points[0];
    const tail = points[points.length - 1];
    const streak = ctx.createLinearGradient(...lead, ...tail);
    streak.addColorStop(0, '#d7fff4');
    streak.addColorStop(.24, '#72ffd6c9');
    streak.addColorStop(1, '#33ebac00');
    trace(ctx, points);
    ctx.strokeStyle = streak;
    ctx.lineWidth = distance < 4 ? 3 : 1.8;
    ctx.stroke();
  }

  drawPacket(ctx, centerX, centerY + height * .015, Math.min(width * .084, height * .16), time);
}

export default function BookingFlightCanvas({ stage }: { stage: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !window.IntersectionObserver || !window.ResizeObserver) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    const root = canvas.parentElement;
    if (!root) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const deviceRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    let visible = false;
    let request = 0;
    let last = 0;
    let time = 0;
    let camera = stageRef.current * travelPerStage;
    let lean: Point = [0, 0];
    let aim: Point = [0, 0];

    const draw = () => {
      paint(context, width, height, camera, time, lean);
      if (!canvas.dataset.ready) canvas.dataset.ready = 'true';
    };

    const render = (now: number) => {
      request = requestAnimationFrame(render);
      const delta = last ? now - last : 16;
      if (last && delta < 15) return;
      last = now;
      const seconds = Math.min(delta, 50) / 1000;
      time += seconds;
      const ease = 1 - Math.exp(-seconds * 4.5);
      camera += (stageRef.current * travelPerStage - camera) * ease;
      lean = [lean[0] + (aim[0] - lean[0]) * ease, lean[1] + (aim[1] - lean[1]) * ease];
      draw();
    };

    const sync = () => {
      const run = visible && !document.hidden && !reduced.matches && width > 0 && height > 0;
      if (run && !request) {
        last = 0;
        request = requestAnimationFrame(render);
      } else if (!run && request) {
        cancelAnimationFrame(request);
        request = 0;
      }
    };
    const resize = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
      const pixelWidth = Math.round(width * deviceRatio);
      const pixelHeight = Math.round(height * deviceRatio);
      if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
      if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
      context.setTransform(deviceRatio, 0, 0, deviceRatio, 0, 0);
      if (visible && width > 0 && height > 0 && !reduced.matches) draw();
      sync();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const point = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = root.getBoundingClientRect();
      aim = [(event.clientX - bounds.left) / bounds.width * 2 - 1, (event.clientY - bounds.top) / bounds.height * 2 - 1];
    };
    const reset = () => { aim = [0, 0]; };
    resize.observe(canvas);
    intersection.observe(canvas);
    root.addEventListener('pointermove', point);
    root.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    return () => {
      cancelAnimationFrame(request);
      resize.disconnect();
      intersection.disconnect();
      root.removeEventListener('pointermove', point);
      root.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full motion-reduce:hidden" />;
}
