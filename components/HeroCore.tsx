'use client';

import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

type Project = (x: number, y: number, z: number) => Point;

const plates = [
  { height: -0.86, radius: 1.43, angle: -0.08, spreadX: 0.05, spreadZ: 0.12 },
  { height: -0.47, radius: 1.26, angle: 0.10, spreadX: -0.20, spreadZ: 0.16 },
  { height: 0.24, radius: 1.18, angle: -0.12, spreadX: -0.35, spreadZ: -0.19 },
  { height: 0.64, radius: 1.34, angle: 0.09, spreadX: 0.38, spreadZ: -0.22 },
];

const rim = [
  [-1, -0.81], [-0.81, -1], [0.81, -1], [1, -0.81],
  [1, 0.81], [0.81, 1], [-0.81, 1], [-1, 0.81],
];

function path(ctx: CanvasRenderingContext2D, points: Point[], close = false) {
  ctx.moveTo(points[0].x, points[0].y);
  for (const { x, y } of points.slice(1)) ctx.lineTo(x, y);
  if (close) ctx.closePath();
}

function light(ctx: CanvasRenderingContext2D, point: Point, radius: number, color: string | CanvasGradient) {
  ctx.beginPath();
  ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function drawPlate(ctx: CanvasRenderingContext2D, project: Project, plate: typeof plates[number], separation: number, time: number, index: number) {
  const height = plate.height * (1 + separation * 0.60);
  const angle = plate.angle + Math.sin(time * 0.7 + index) * 0.022 + plate.angle * separation * 1.5;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const at = (x: number, z: number, offset = 0) =>
    project(
      x * cos - z * sin + plate.spreadX * separation,
      height + offset,
      x * sin + z * cos + plate.spreadZ * separation,
    );
  const outline = rim.map(([x, z]) => at(x * plate.radius, z * plate.radius));
  const base = rim.map(([x, z]) => at(x * plate.radius, z * plate.radius, -0.065));
  const socket = rim.map(([x, z]) => at(x * 0.43, z * 0.43));

  for (let i = 0; i < outline.length; i++) {
    const next = (i + 1) % outline.length;
    if (outline[next].x < outline[i].x) continue;
    ctx.beginPath();
    path(ctx, [outline[i], outline[next], base[next], base[i]], true);
    ctx.fillStyle = i % 2 ? '#153b34' : '#0c2521';
    ctx.strokeStyle = '#276451';
    ctx.fill();
    ctx.stroke();
  }

  const surface = ctx.createLinearGradient(outline[0].x, outline[0].y, outline[4].x, outline[4].y);
  surface.addColorStop(0, '#192b2b');
  surface.addColorStop(0.5, '#081514');
  surface.addColorStop(1, '#102e28');
  ctx.beginPath();
  path(ctx, outline, true);
  path(ctx, socket, true);
  ctx.fillStyle = surface;
  ctx.fill('evenodd');
  ctx.strokeStyle = index === 3 ? '#62d9b9' : '#3e997e';
  ctx.lineWidth = 1;
  ctx.stroke();

  const r = plate.radius;
  ctx.lineWidth = 0.75;
  for (let side = 0; side < 4; side++) {
    const rotation = side * Math.PI / 2;
    const dx = Math.cos(rotation);
    const dz = Math.sin(rotation);
    const traceAt = (x: number, z: number) => at(x * dx - z * dz, x * dz + z * dx, 0.005);

    for (let track = 0; track < 3; track++) {
      const start = (0.52 + track * 0.11) * r;
      const lane = (0.18 + track * 0.17) * r;
      const nodes = [
        traceAt(start, -r * 0.74), traceAt(start, -lane),
        traceAt(start + r * 0.10, -lane + r * 0.10),
        traceAt(start + r * 0.10, r * 0.71),
      ];
      ctx.beginPath();
      path(ctx, nodes);
      ctx.strokeStyle = track === 1 ? '#32866f' : '#235246';
      ctx.stroke();
      light(ctx, nodes[0], 1.2, '#488e7b');
      light(ctx, nodes[3], 1.4, '#67b49f');

      if (track !== 1) continue;
      const progress = (time * (0.54 + separation * 0.28) + side * 0.37 + index * 0.29) % 3;
      const segment = Math.floor(progress);
      const from = nodes[segment];
      const to = nodes[segment + 1];
      const fraction = progress - segment;
      const pulse = { x: from.x + (to.x - from.x) * fraction, y: from.y + (to.y - from.y) * fraction };
      light(ctx, pulse, 4, '#39ecae35');
      light(ctx, pulse, 1.65, '#c9ffe3');
    }
  }
  ctx.lineWidth = 1;
}

function drawCore(ctx: CanvasRenderingContext2D, project: Project, time: number, separation: number, scale: number) {
  const center = project(0, -0.05, 0.18);
  const radius = scale * (0.92 + separation * 0.36);
  const aura = ctx.createRadialGradient(center.x, center.y, 0, center.x, center.y, radius);
  aura.addColorStop(0, '#71ffd0b0');
  aura.addColorStop(0.23, '#22f4aa55');
  aura.addColorStop(1, '#0bdf9800');
  light(ctx, center, radius, aura);

  const rotation = time * 0.7;
  const rings = [-0.31, 0.20].map(y => Array.from({ length: 6 }, (_, i) => {
    const angle = rotation + i * Math.PI / 3;
    return project(Math.cos(angle) * 0.35, y, Math.sin(angle) * 0.35 + 0.18);
  }));
  ctx.beginPath();
  path(ctx, rings[1], true);
  ctx.fillStyle = '#82fcd388';
  ctx.fill();
  ctx.strokeStyle = '#81ffd3';
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  path(ctx, rings[0], true);
  path(ctx, rings[1], true);
  for (let i = 0; i < 6; i++) path(ctx, [rings[0][i], rings[1][i]]);
  ctx.stroke();
  ctx.lineWidth = 1;
  light(ctx, center, 3 + separation * 2, '#c3ffe7');

  for (let i = 0; i < 26; i++) {
    const angle = time * (i % 2 ? 0.34 : -0.22) + i * 2.39996;
    const orbit = 0.58 + i % 7 * 0.20 + separation * 0.20;
    const point = project(Math.cos(angle) * orbit, -0.18 + Math.sin(angle * 1.7 + i) * 0.62, Math.sin(angle) * orbit);
    light(ctx, point, i % 4 ? 1.1 : 2, i % 4 ? '#5beab77c' : '#a4f8d2');
  }
}

function drawScene(ctx: CanvasRenderingContext2D, width: number, height: number, time: number, x: number, y: number, separation: number) {
  ctx.clearRect(0, 0, width, height);
  const scale = Math.min(width * 0.21, height * 0.28) / (1 + separation * 0.12);
  const yaw = -0.67 + Math.sin(time * 0.30) * 0.14 + x * 0.52;
  const pitch = 0.43 + y * 0.17 - separation * 0.09;
  const cosYaw = Math.cos(yaw);
  const sinYaw = Math.sin(yaw);
  const cosPitch = Math.cos(pitch);
  const sinPitch = Math.sin(pitch);
  const project: Project = (px, py, pz) => {
    const x = px * cosYaw - pz * sinYaw;
    const z = px * sinYaw + pz * cosYaw;
    const depth = py * sinPitch + z * cosPitch;
    const factor = scale * 6 / (6 - depth);
    return {
      x: width * 0.51 + x * factor,
      y: height * 0.51 + (z * sinPitch - py * cosPitch) * factor,
    };
  };

  const halo = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, scale * 2.5);
  halo.addColorStop(0, '#15c68a2d');
  halo.addColorStop(1, '#15c68a00');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, width, height);

  for (let orbit = 0; orbit < 2; orbit++) {
    const points = Array.from({ length: 49 }, (_, i) => {
      const angle = i / 48 * Math.PI * 2;
      const radius = 1.8 + orbit * 0.30 + separation * 0.14;
      return project(radius * Math.cos(angle), -0.86 + orbit * 0.11, radius * Math.sin(angle));
    });
    ctx.beginPath();
    path(ctx, points, true);
    ctx.strokeStyle = orbit ? '#257b6648' : '#39b89360';
    ctx.stroke();
  }

  plates.forEach((plate, index) => {
    if (index === 2) drawCore(ctx, project, time, separation, scale);
    drawPlate(ctx, project, plate, separation, time, index);
  });
}

interface HeroCoreProps {
  expanded: boolean;
  onReady: (ready: boolean) => void;
}

export default function HeroCore({ expanded, onReady }: HeroCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const expandedRef = useRef(expanded);

  useEffect(() => { expandedRef.current = expanded; }, [expanded]);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element || !window.IntersectionObserver || !window.ResizeObserver) return;
    const canvas = element;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const scene = canvas.closest('section');
    const context = canvas.getContext('2d');
    if (!context || !scene) return;
    const ctx = context;

    let width = 0;
    let height = 0;
    let intersects = false;
    let frame: number | undefined;
    let lastDraw = 0;
    let time = 0;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let separation = 0;
    let ready = false;

    function animate(now: number) {
      frame = requestAnimationFrame(animate);
      const delta = lastDraw ? now - lastDraw : 16;
      if (lastDraw && delta < (coarse ? 29 : 14)) return;
      lastDraw = now;
      time += Math.min(delta, 60) / 1000;
      x += (targetX - x) * 0.065;
      y += (targetY - y) * 0.065;
      separation += ((expandedRef.current ? 1 : 0) - separation) * 0.06;
      drawScene(ctx, width, height, time, x, y, separation);
      if (!ready) {
        ready = true;
        onReady(true);
      }
    }

    function updateAnimation() {
      const shouldRun = intersects && !document.hidden && !reduced.matches && width > 0 && height > 0;
      if (shouldRun && frame === undefined) {
        lastDraw = 0;
        frame = requestAnimationFrame(animate);
      } else if (!shouldRun && frame !== undefined) {
        cancelAnimationFrame(frame);
        frame = undefined;
      }
      if (reduced.matches && ready) {
        ready = false;
        onReady(false);
      }
    }

    function resize() {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, coarse ? 1.3 : 1.65);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      updateAnimation();
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== 'mouse' || reduced.matches || !width || !height) return;
      if (event.target instanceof Element && event.target.closest('a, button')) {
        reset();
        return;
      }
      const bounds = canvas.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    }

    function reset() {
      targetX = 0;
      targetY = 0;
    }

    const observer = new IntersectionObserver(([entry]) => {
      intersects = entry.isIntersecting;
      updateAnimation();
    });
    const sizes = new ResizeObserver(resize);
    observer.observe(canvas);
    sizes.observe(canvas);
    scene.addEventListener('pointermove', move);
    scene.addEventListener('pointerleave', reset);
    document.addEventListener('visibilitychange', updateAnimation);
    reduced.addEventListener('change', updateAnimation);
    return () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      observer.disconnect();
      sizes.disconnect();
      scene.removeEventListener('pointermove', move);
      scene.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', updateAnimation);
      reduced.removeEventListener('change', updateAnimation);
    };
  }, [onReady]);

  return <canvas ref={canvasRef} aria-hidden="true" className="hero-core-canvas h-full w-full" />;
}
