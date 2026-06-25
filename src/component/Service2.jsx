import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "../styles/service2.css";


const services = [
  {
    title: "Web Design",
    description:
      "Modern, clean, and conversion-focused UI/UX designs that make brands stand out.",
    img: "/webdesign.png",
  },
  {
    title: "Web Development",
    description:
      "Fast, scalable, and maintainable websites built with modern technologies.",
    img: "/webdev.png",
  },
  // {
  //   title: "Meta Ads",
  //   description:
  //     "High-performing Facebook & Instagram ad campaigns driven by data.",
  //   img: null,
  // },
  {
    title: "SEO",
    description:
      "Search-optimized websites designed to rank, convert, and scale organically.",
    img: null,
  },
];

const Service2 = () => {

const cardsRef = useRef([]);
  const lineRef = useRef(null);
  const [svgContent, setSvgContent] = useState(null);


  // Animate service cards
  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card,index) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 80 },
          {
            opacity: 1,
            y: 0,
            rotate: `${index%2==0?5:-5}`,
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
    fetch("/line5.svg")
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
        <p className="services-subtitle">
          <span>What I do</span>
        </p>
        <h2 className="services-heading">Capabilities that <span>move</span> things.</h2>

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
                <img src={service.img || "/demo.png"} alt="" />
                <div className="card-text">
                    <h3>{service.title}</h3>
                    <p>{service.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Service2