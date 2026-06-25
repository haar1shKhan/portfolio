import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LuFacebook, LuInstagram, LuLinkedin } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa";
import "../styles/footer2.css";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const bigNameRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Big name reveals on scroll
      gsap.from(bigNameRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
        },
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="footer-section">

      {/* Top row — logo + nav */}
      <div className="footer-top">
        <div className="footer-logo">HK</div>
        <nav className="footer-nav">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Work</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>

      {/* Divider */}
      <div className="footer-divider" />

      {/* Middle — big name + availability */}
      <div className="footer-middle">
        <h2 ref={bigNameRef} className="footer-big-name">
          Haarish<br />
          <em>Khan.</em>
        </h2>

        <div className="footer-right-col">
          <div className="footer-badge">
            <span className="footer-badge-dot" />
            Available for projects
          </div>

          <p className="footer-tagline">
            Creative Developer based in UAE.<br />
            Building websites that feel like something.
          </p>

          <div className="footer-socials">
            <a href="https://www.facebook.com/profile.php?id=100004967836172" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <LuFacebook size={18} />
            </a>
            <a href="https://www.instagram.com/_haarish_khan_/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <LuInstagram size={18} />
            </a>
            <a href="https://www.linkedin.com/in/haarish-khan/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LuLinkedin size={18} />
            </a>
            <a href="https://wa.me/971569021105" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="footer-divider" />

      {/* Bottom row — copyright + credit */}
      <div className="footer-bottom">
        <p className="footer-copy">
          &copy; {new Date().getFullYear()} Haarish Khan. All rights reserved.
        </p>
        <p className="footer-credit">
          Designed & built by Haarish — no templates were harmed.
        </p>
      </div>

    </footer>
  );
};

export default Footer;