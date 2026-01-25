import { useEffect, useRef } from "react";
import "../styles/about.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const aboutRef = useRef(null);
  const textRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate text
      gsap.from(textRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: textRef.current,
          start: "top 80%", // when top of text hits 80% of viewport
          toggleActions: "play none none reverse",
        },
      });

      // Animate stats
      gsap.from(statsRef.current.children, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2, // stagger each stat
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 75%", // when stats enter viewport
          toggleActions: "play none none reverse",
        },
      });
    }, aboutRef);

    return () => ctx.revert(); // cleanup
  }, []);

  return (
    <section className="about" id="about" ref={aboutRef}>
      <div className="about-container">
        <div className="about-text" ref={textRef}>
          <h2>About Me</h2>

          <p>
            I am a web developer and designer with hands-on experience building
            responsive websites, landing pages, and web applications.
          </p>

          <p>
            I focus on performance, clean UI/UX, and SEO-friendly architecture
            to help businesses grow online.
          </p>

          <a href="#contact" className="btn primary">
            Let's Work Together
          </a>
        </div>

        <div className="about-stats" ref={statsRef}>
          <Stat value="2+" label="Years Experience" />
          <Stat value="20+" label="Projects Completed" />
          <Stat value="100%" label="Client Satisfaction" />
        </div>
      </div>
    </section>
  );
};

const Stat = ({ value, label }) => (
  <div className="stat">
    <h3>{value}</h3>
    <span>{label}</span>
  </div>
);

export default About;
