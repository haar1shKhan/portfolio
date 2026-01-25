import { useEffect, useRef } from "react";
import "../styles/hero.css";
import gsap from "gsap";

const Hero = () => {
  const imageRef = useRef(null);
  const headingRef = useRef(null);
  const paragraphRef = useRef(null);
  const buttonsRef = useRef([]);

  useEffect(() => {
    // Reset all elements to hidden state before animation
    gsap.set([imageRef.current, headingRef.current, paragraphRef.current, ...buttonsRef.current], {
      opacity: 0,
      y: 30,
    });

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.to(imageRef.current, {
      opacity: 1,
      y: 0,
      duration: 1,
    })
      .to(
        headingRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.5"
      )
      .to(
        paragraphRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
        },
        "-=0.4"
      )
      .to(
        buttonsRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
        },
        "-=0.5"
      );
  }, []);

  return (
    <section className="hero" id="home">
      <div className="hero-image" ref={imageRef}>
        <img src="/your-image.png" alt="Haarish Khan" />
      </div>

      <div className="hero-content">
        <h1 ref={headingRef}>Professional Web Developer & Designer</h1>

        <p ref={paragraphRef}>
          I'm Haarish Khan, a full-stack web developer & designer focused on
          building clean, modern, and high-performance digital experiences.
        </p>

        <div className="hero-actions">
          <a
            href="#portfolio"
            className="btn primary"
            ref={(el) => (buttonsRef.current[0] = el)}
          >
            View My Work
          </a>
          <a
            href="https://wa.me/971569021105"
            className="btn secondary"
            ref={(el) => (buttonsRef.current[1] = el)}
          >
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
