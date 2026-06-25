import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import "../styles/navbar2.css";
import { RibbonCursor } from "./RibbonCursor";

const SplitLink = ({ href, children, onClick, addRef }) => {
  const linkRef = useRef(null);

  const handleMove = (e) => {
    const chars = linkRef.current.querySelectorAll(".char-wrap");
    
    chars.forEach((wrap) => {
      const rect = wrap.getBoundingClientRect();
      const charCenterX = rect.left + rect.width / 2;
      const charCenterY = rect.top + rect.height / 2;

      const dist = Math.sqrt(
        (e.clientX - charCenterX) ** 2 + 
        (e.clientY - charCenterY) ** 2
      );

      // max influence radius — beyond this, no effect
      const radius = 120;
      // how far the halves split at closest point
      const maxSplit = 55;

      const strength = Math.max(0, 1 - dist / radius);
      const splitY = strength * maxSplit;
      const fade = 1 - strength * 0.75;

      const top = wrap.querySelector(".char-top");
      const bot = wrap.querySelector(".char-bot");

      gsap.to(top, { y: `-${splitY}%`, opacity: fade, duration: 0.25, ease: "power2.out", overwrite: true });
      gsap.to(bot, { y: `${splitY}%`, opacity: fade, duration: 0.25, ease: "power2.out", overwrite: true });
    });
  };

  const handleLeave = () => {
    const tops = linkRef.current.querySelectorAll(".char-top");
    const bots = linkRef.current.querySelectorAll(".char-bot");
    gsap.to([...tops, ...bots], {
      y: "0%",
      opacity: 1,
      stagger: 0.02,
      duration: 0.5,
      ease: "power3.out",
      overwrite: true,
    });
  };

  return (
    
      <a ref={(el) => {
        linkRef.current = el;
        if (addRef) addRef(el);
      }}
      href={href}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {[...children].map((char, i) => (
        <span key={i} className="char-wrap">
          <span className="char-ghost">{char}</span>
          <span className="char-top">{char}</span>
          <span className="char-bot">{char}</span>
        </span>
      ))}
    </a>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuWrapperRef = useRef(null);
  const circleRef = useRef(null);
  const linksRef = useRef([]);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const tl = useRef(null);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const addToRefs = (el) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  useLayoutEffect(() => {
    const circle = circleRef.current;
    const menu = menuRef.current;
    const hamburger = hamburgerRef.current;

    const hRect = hamburger.getBoundingClientRect();
    const hCenterX = hRect.left + hRect.width / 2;
    const hCenterY = hRect.top + hRect.height / 2;

    const farthestX = Math.max(hCenterX, window.innerWidth - hCenterX);
    const farthestY = Math.max(hCenterY, window.innerHeight - hCenterY);
    const size = Math.sqrt(farthestX ** 2 + farthestY ** 2) * 2;

    gsap.set(circle, {
      width: size,
      height: size,
      x: hCenterX - size / 2,
      y: hCenterY - size / 2,
      scale: 0,
      transformOrigin: "center center",
    });

    gsap.set(menu, { autoAlpha: 0 });
    gsap.set(linksRef.current, { y: 40, opacity: 0 });

    tl.current = gsap.timeline({ paused: true });

    tl.current
      .to(circle, {
        scale: 1,
        duration: 0.9,
        ease: "power4.inOut",
      })
      .to(menu, { autoAlpha: 1, duration: 0.2 }, "-=0.4")
      .fromTo(
        linksRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          duration: 0.55,
          ease: "power3.out",
        },
        "-=0.2"
      );
  }, []);

  useLayoutEffect(() => {
    if (!tl.current) return;
    const wrapper = menuWrapperRef.current;

    if (isOpen) {
      wrapper.style.pointerEvents = "all";
      tl.current.play();
    } else {
      tl.current.reverse();
      tl.current.eventCallback("onReverseComplete", () => {
        wrapper.style.pointerEvents = "none";
      });
    }

    if (isOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }
  }, [isOpen]);

  return (
    <>
      <RibbonCursor isActive={isOpen} />
      <header className="navbar">
        <h2 className="logo">HK</h2>
        <div className="nav-actions">
          
          <a  href="https://wa.me/971569021105"
            className={`btn primary ${isOpen ? "menu-open" : ""}`}
          >
            Hire Me
          </a>
          <div
            ref={hamburgerRef}
            className={`hamburger ${isOpen ? "active" : ""}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </header>

      <div ref={menuWrapperRef} className="menu-wrapper">
        <div ref={circleRef} className="circle-bg"></div>
        <div ref={menuRef} className="fullscreen-menu">
          <nav>
            <SplitLink href="#home" onClick={toggleMenu} addRef={addToRefs}>Home</SplitLink>
            <SplitLink href="#portfolio" onClick={toggleMenu} addRef={addToRefs}>Portfolio</SplitLink>
            <SplitLink href="#about" onClick={toggleMenu} addRef={addToRefs}>About</SplitLink>
            <SplitLink href="#services" onClick={toggleMenu} addRef={addToRefs}>Services</SplitLink>
            <SplitLink href="#contact" onClick={toggleMenu} addRef={addToRefs}>Contact</SplitLink>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;