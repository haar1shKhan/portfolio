import { useEffect, useRef } from "react";

export function useRibbonCursor(isActive) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const mouse = useRef(null);
  const trail = useRef([]);
  const isMoving = useRef(false);
  const stopTimer = useRef(null);
  const isActiveRef = useRef(isActive);

  // Keep isActiveRef in sync without re-running the effect
  useEffect(() => {
    isActiveRef.current = isActive;
    if (!isActive) {
      isMoving.current = false;
    }
  }, [isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const MAX = 30;

    const onMouseMove = (e) => {
      // Initialize mouse on first move
      if (!mouse.current) {
        mouse.current = { x: e.clientX, y: e.clientY };
      }
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (isActiveRef.current) {
        isMoving.current = true;
        clearTimeout(stopTimer.current);
        stopTimer.current = setTimeout(() => {
          isMoving.current = false;
        }, 60);
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isActiveRef.current && mouse.current) {
        if (isMoving.current) {
          const last = trail.current[0];
          const dx = mouse.current.x - (last?.x ?? mouse.current.x);
          const dy = mouse.current.y - (last?.y ?? mouse.current.y);
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (!last || dist > 1.5) {
            trail.current.unshift({
              x: mouse.current.x,
              y: mouse.current.y,
            });
            if (trail.current.length > MAX) trail.current.pop();
          }
        } else {
          // Drain tail — ribbon retracts when stopped
          if (trail.current.length > 0) {
            trail.current.splice(trail.current.length - 3, 3);
          }
        }
      } else {
        // Drain fast when menu closed
        if (trail.current.length > 0) {
          trail.current.splice(trail.current.length - 6, 6);
        }
      }

      if (trail.current.length >= 6) {
        drawInkRibbon(ctx, trail.current);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      clearTimeout(stopTimer.current);
      cancelAnimationFrame(rafRef.current);
    };
  }, []); // runs once only — isActiveRef handles the live value

  return canvasRef;
}

function catmullRomPoint(p0, p1, p2, p3, t) {
  const t2 = t * t;
  const t3 = t2 * t;
  return {
    x:
      0.5 *
      (2 * p1.x +
        (-p0.x + p2.x) * t +
        (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
        (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
    y:
      0.5 *
      (2 * p1.y +
        (-p0.y + p2.y) * t +
        (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
        (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
  };
}

function drawInkRibbon(ctx, points) {
  const total = points.length;
  if (total < 6) return;

  // Upsample with Catmull-Rom for glass-smooth curve
  const spline = [];
  for (let i = 0; i < total - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, total - 1)];
    for (let s = 0; s < 6; s++) {
      spline.push(catmullRomPoint(p0, p1, p2, p3, s / 6));
    }
  }
  spline.push(points[total - 1]);

  const splineLen = spline.length;
  const leftEdge = [];
  const rightEdge = [];

  for (let i = 0; i < splineLen; i++) {
    const t = i / splineLen;

    // Width: thin tip → thick body → tapered tail
    let width;
    if (t < 0.08) {
      width = 1 + 3 * (t / 0.08);
    } else if (t < 0.75) {
      width = 4 + Math.sin(t * Math.PI * 3) * 2;
    } else {
      width = 4 * (1 - (t - 0.75) / 0.25);
    }

    // Perpendicular normal from tangent
    const prev = spline[Math.max(i - 1, 0)];
    const next = spline[Math.min(i + 1, splineLen - 1)];
    const tx = next.x - prev.x;
    const ty = next.y - prev.y;
    const len = Math.sqrt(tx * tx + ty * ty) || 1;
    const nx = -ty / len;
    const ny = tx / len;

    const cx = spline[i].x;
    const cy = spline[i].y;

    leftEdge.push({ x: cx + nx * width * 0.5, y: cy + ny * width * 0.5 });
    rightEdge.push({ x: cx - nx * width * 0.5, y: cy - ny * width * 0.5 });
  }

  // Draw filled ribbon polygon
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(leftEdge[0].x, leftEdge[0].y);

  for (let i = 1; i < leftEdge.length - 1; i++) {
    const cpx = (leftEdge[i].x + leftEdge[i + 1].x) / 2;
    const cpy = (leftEdge[i].y + leftEdge[i + 1].y) / 2;
    ctx.quadraticCurveTo(leftEdge[i].x, leftEdge[i].y, cpx, cpy);
  }

  for (let i = rightEdge.length - 1; i > 0; i--) {
    const cpx = (rightEdge[i].x + rightEdge[i - 1].x) / 2;
    const cpy = (rightEdge[i].y + rightEdge[i - 1].y) / 2;
    ctx.quadraticCurveTo(rightEdge[i].x, rightEdge[i].y, cpx, cpy);
  }

  ctx.closePath();

  const head = spline[0];
  const tail = spline[splineLen - 1];
  const grad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
  grad.addColorStop(0,    "rgba(245,240,232,0.98)");
  grad.addColorStop(0.5,  "rgba(245,240,232,0.88)");
  grad.addColorStop(0.82, "rgba(245,240,232,0.35)");
  grad.addColorStop(1,    "rgba(245,240,232,0)");

  ctx.fillStyle = grad;
  ctx.fill();

  // Wet ink sheen along spine
  ctx.beginPath();
  ctx.moveTo(spline[0].x, spline[0].y);
  const sheenEnd = Math.floor(splineLen * 0.55);
  for (let i = 1; i < sheenEnd - 1; i++) {
    const cpx = (spline[i].x + spline[i + 1].x) / 2;
    const cpy = (spline[i].y + spline[i + 1].y) / 2;
    ctx.quadraticCurveTo(spline[i].x, spline[i].y, cpx, cpy);
  }

  const sheen = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
  sheen.addColorStop(0,   "rgba(255,255,255,0.7)");
  sheen.addColorStop(0.35,"rgba(255,255,255,0.2)");
  sheen.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.strokeStyle = sheen;
  ctx.lineWidth = 1.5;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.restore();
}