import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * LoadingScreen
 * -------------
 * Drop this at the top of your root layout / App component, above (or wrapping)
 * everything else. It sits on top of the page (position: fixed, full viewport)
 * as 5 vertical columns until every <img> on the page (plus web fonts) has
 * actually finished loading — not just a fake timer. Once loading is done it
 * plays a staggered "peel up" reveal with GSAP and unmounts itself.
 *
 * Usage:
 *   function App() {
 *     return (
 *       <>
 *         <LoadingScreen />
 *         <Navbar />
 *         <main>...</main>
 *       </>
 *     );
 *   }
 *
 * If you're on Next.js (App Router), add "use client" at the top of the file
 * that renders this component.
 *
 * Colors pulled straight from your repo (src/styles/*.css):
 *   --ink:   #0f0f12   (loader panels)
 *   --cream: #F5F0E8   (counter text, matches your hero bg)
 *   --accent:#FF4D00
 * Fonts: Syne (display / counter), DM Sans (label) — both already loaded
 * globally in src/index.css.
 */

const COLUMN_COUNT = 5;
const MIN_DISPLAY_MS = 900; // keeps the loader from flashing on fast connections

export default function LoadingScreen({ onComplete }) {
  const containerRef = useRef(null);
  const columnRefs = useRef([]);
  const counterRef = useRef(null);
  const labelRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
  let cancelled = false;
  let finished = false;
  const startTime = Date.now();

  const images = Array.from(document.querySelectorAll("img"));
  const total = images.length;
  let loaded = 0;

  const finish = () => {
    if (finished || cancelled) return;
    finished = true;
    const wait = Math.max(0, MIN_DISPLAY_MS - (Date.now() - startTime));
    setTimeout(() => {
      if (cancelled) return;
      setProgress(100);
      setDone(true);
    }, wait);
  };

  const bumpProgress = () => {
    loaded += 1;
    if (cancelled) return;
    setProgress(total === 0 ? 100 : Math.round((loaded / total) * 100));
    if (loaded >= total) finish();
  };

  images.forEach((img) => {
    // Lazy images never load until scrolled to; force them to load now
    img.loading = "eager";

    if (img.complete) {
      bumpProgress();
    } else {
      img.addEventListener("load", bumpProgress, { once: true });
      img.addEventListener("error", bumpProgress, { once: true });
    }
  });

  if (total === 0) finish();

  // Safety net: never let the loader hang, no matter what
  const timeout = setTimeout(finish, 6000);

  return () => {
    cancelled = true;
    clearTimeout(timeout);
  };
}, []);

  // Animate the counter number smoothly toward the real progress value
  useEffect(() => {
    if (!counterRef.current) return;
    const obj = { val: Number(counterRef.current.dataset.val || 0) };
    gsap.to(obj, {
      val: progress,
      duration: 0.5,
      ease: "power1.out",
      onUpdate: () => {
        if (counterRef.current) {
          counterRef.current.textContent = String(Math.round(obj.val));
          counterRef.current.dataset.val = obj.val;
        }
      },
    });
  }, [progress]);

  // Reveal animation once loading is fully done
  useEffect(() => {
    if (!done) return;

    const tl = gsap.timeline({
      onComplete: () => {
        if (containerRef.current) containerRef.current.style.display = "none";
        onComplete && onComplete();
      },
    });

    tl.to([counterRef.current, labelRef.current], {
      opacity: 0,
      y: -16,
      duration: 0.35,
      ease: "power2.in",
    }).to(
      columnRefs.current,
      {
        yPercent: -100,
        duration: 1.1,
        ease: "power4.inOut",
        stagger: 0.09,
      },
      "-=0.1"
    );
  }, [done, onComplete]);

  return (
    <div ref={containerRef} className="ls-root" aria-hidden={done}>
      <div className="ls-columns">
        {Array.from({ length: COLUMN_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (columnRefs.current[i] = el)}
            className="ls-column"
          />
        ))}
      </div>

      <div className="ls-overlay">
        <span ref={labelRef} className="ls-label">
          Loading
        </span>
        <span ref={counterRef} className="ls-counter" data-val="0">
          0
        </span>
      </div>

      <style>{`
        .ls-root {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
        }
        .ls-columns {
          position: absolute;
          inset: 0;
          display: flex;
          width: 100%;
          height: 100%;
        }
        .ls-column {
          flex: 1 0 20%;
          height: 100%;
          background: #0f0f12;
        }
        .ls-overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .ls-label {
          font-family: "DM Sans", sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #f5f0e8;
          opacity: 0.7;
        }
        .ls-counter {
          font-family: "Syne", sans-serif;
          font-weight: 700;
          font-size: clamp(2.5rem, 8vw, 5rem);
          color: #f5f0e8;
          line-height: 1;
        }
        .ls-counter::after {
          content: "%";
          font-size: 0.4em;
          margin-left: 0.15em;
          color: #ff4d00;
        }
      `}</style>
    </div>
  );
}