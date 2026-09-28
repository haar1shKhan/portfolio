import React, { useEffect, useRef } from 'react'
import '../styles/about2.css'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, SplitText);

// Put the images in /public/certs/
const CERTS = [
  { src: '/certs/cert-cpd.jpg',          w: 1075, h: 1520, title: 'CPD Certified – Complete Digital Marketing' },
  { src: '/certs/cert-khda.jpg', w: 1075, h: 1520, title: 'Learners Point – Course Certificate' },
  { src: '/certs/cert-learnerspoint.jpg',          w: 1521, h: 1075, title: 'KHDA Attested Training Certificate' },
];

const About = () => {
  const boxRef = useRef(null);
  const scrimRef = useRef(null);
  const horizontalRef = useRef(null);
  const certsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      let split = SplitText.create(".split", { type: "words" });
      let splitp = SplitText.create(".paragraph", { type: "lines" });

      gsap.from(split.words, {
        y: 100,
        autoAlpha: 0,
        stagger: 0.05,
        ease: "power3.out",
        scrollTrigger: { trigger: ".split", start: "top center" },
      });

      gsap.set(scrimRef.current, { opacity: 0 });
      gsap.set(splitp.lines, { autoAlpha: 0, y: 30 });
      gsap.set(".stat", { autoAlpha: 0, y: 20 });

      const panels = gsap.utils.toArray(horizontalRef.current.children);
      const IMAGE_PHASE_PX = 1800;   // grow/reveal
      const READ_PAUSE_PX = 500;     // dead zone for reading
      const SPREAD_PX = 700;         // scroll budget for the certificate spread
      const horizontalDistance = () =>
        horizontalRef.current.offsetWidth * (panels.length - 1);

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: horizontalRef.current,
          start: "top top",
          end: () =>
            "+=" + (IMAGE_PHASE_PX + READ_PAUSE_PX + horizontalDistance() + SPREAD_PX),
          scrub: true,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          snap: {
            snapTo: "labels",
            duration: { min: 0.2, max: 0.6 },
            ease: "power1.inOut",
          },
        },
      });

      // --- Phase 1 ---
      master
        .addLabel("aboutStart")
        .to(boxRef.current, {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          ease: "none",
        })
        .to(scrimRef.current, { opacity: 1, ease: "none" })
        .to(splitp.lines, {
          autoAlpha: 1,
          y: 0,
          stagger: 0.04,
          ease: "none",
        }, "<")
        .to(".stat", {
          autoAlpha: 1,
          y: 0,
          stagger: 0.08,
          ease: "none",
        }, "<0.1");

      const timePerPx = master.duration() / IMAGE_PHASE_PX;

      // --- Hold ---
      master.addLabel("aboutEnd");
      master.to({}, { duration: timePerPx * READ_PAUSE_PX });

      // --- Phase 2: horizontal pan ---
      const perPanelDuration = timePerPx * (horizontalDistance() / (panels.length - 1));

      panels.forEach((panel, i) => {
        if (i === 0) return;
        master.to(panels, {
          xPercent: -100 * i,
          ease: "none",
          duration: perPanelDuration,
        });
        const label = panel.id ? `${panel.id}Start` : `panel${i}Start`;
        master.addLabel(label);
      });

      // --- Phase 3: certificates spread out of the stack ---
      // Cards are laid out in a row (their final spot). We start each one
      // collapsed onto the middle card, slightly fanned, then animate to x:0.
      const cards = gsap.utils.toArray(".cert-card", certsRef.current);
      const mid = cards[Math.floor(cards.length / 2)];

      master.from(cards, {
        // function-based values are re-evaluated on resize (invalidateOnRefresh)
        x: (i, el) => {
          const m = mid.getBoundingClientRect();
          const e = el.getBoundingClientRect();
          const stackOffset = (i - 1) * 28; // small peek so the stack reads as 3 cards
          return (m.left + m.width / 2) - (e.left + e.width / 2) + stackOffset;
        },
        y: (i) => (i === 1 ? 0 : 14),
        rotation: (i) => (i - 1) * 9,
        scale: 0.92,
        ease: "power2.out",
        duration: timePerPx * SPREAD_PX,
        stagger: 0,
      });
      master.addLabel("certificationsEnd");

      // Stack order: middle card on top, like your sketch
      gsap.set(cards, { zIndex: (i) => (i === 1 ? 3 : 1) });

    });

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="about">
      <div className="about-content">
        <h2 className='split'>Anyone can launch a website in an afternoon.
          Not everyone can make it <span className='accent'>stay</span> in someone's head.</h2>
      </div>

      <div className="horizontal-scroll-wrapper" ref={horizontalRef}>
        <div className="about-image-wrap h-panel">
          <div className="about-image-box" ref={boxRef}>
            <img className="desk" src="/desk.png" alt="" />
          </div>

          <div className="about-scrim" ref={scrimRef} />

          <div className="about-overlay">
            <p className='paragraph'>
              I'm <b>Haarish</b>, a creative developer who blends thoughtful design with clean code. I build websites that don't just work—they leave an impression.
              Currently open to freelance projects.
            </p>

            <div className="stats">
              <div className="stat"><h3>2+</h3><p>Years Experience</p></div>
              <div className="stat"><h3>20+</h3><p>Projects Completed</p></div>
              <div className="stat"><h3>100%</h3><p>Client Satisfaction</p></div>
            </div>
          </div>
        </div>

        <section id="certifications" className="about-certifications h-panel">
          <h2>Certifications</h2>

          <div className="cert-row" ref={certsRef}>
            {CERTS.map((c) => (
              <div className="cert-card" key={c.src}>
                <a href={c.src} target="_blank" rel="noreferrer" title={c.title}>
                  <img src={c.src} width={c.w} height={c.h} alt={c.title} loading="lazy" draggable="false" />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}

export default About