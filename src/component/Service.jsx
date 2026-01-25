import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "../styles/service.css";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Web Design",
    description:
      "Modern, clean, and conversion-focused UI/UX designs that make brands stand out.",
  },
  {
    title: "Web Development",
    description:
      "Fast, scalable, and maintainable websites built with modern technologies.",
  },
  {
    title: "Meta Ads",
    description:
      "High-performing Facebook & Instagram ad campaigns driven by data.",
  },
  {
    title: "SEO",
    description:
      "Search-optimized websites designed to rank, convert, and scale organically.",
  },
];

const Service = () => {
  const cardsRef = useRef([]);
  const lineRef = useRef(null);
  const [svgContent, setSvgContent] = useState(null);

  // Initialize Lenis for smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // smooth scroll duration
      easing: (t) => t, // easing function
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Tell ScrollTrigger to update on Lenis scroll
    lenis.on("scroll", ScrollTrigger.update);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  // Animate service cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top center", // start when top of card hits middle of viewport
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }, cardsRef);

    return () => ctx.revert();
  }, []);

  // Load SVG from public folder
  useEffect(() => {
    fetch("/line.svg")
      .then((res) => res.text())
      .then((data) => setSvgContent(data));
  }, []);

  // Animate SVG line on scroll
  useEffect(() => {
    if (!svgContent || !lineRef.current) return;

    const line =
      lineRef.current.querySelector("line") ||
      lineRef.current.querySelector("path");
    if (!line) return;

    const length = line.getTotalLength();
    line.style.strokeDasharray = length;
    line.style.strokeDashoffset = length;

    gsap.to(line, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".services-stage",
        start: "top center",
        end: "bottom center",
        scrub: true,
      },
    });
  }, [svgContent]);

  return (
    <section className="services-section" id="services">
      <div className="services-wrapper">
        <h2 className="services-heading">What I Bring to the Table</h2>
        <p className="services-subtitle">
          I mix creativity and strategy to help your business work smarter.
        </p>

        {/* SVG line injected inline */}
        {svgContent && (
          <div
            ref={lineRef}
            className="services-line"
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}

        <div className="services-stage">
          {services.map((service, index) => (
            <div
              className={`service-card ${index % 2 === 0 ? "left" : "right"}`}
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
            >
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Service;
