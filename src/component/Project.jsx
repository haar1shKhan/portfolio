import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import "../styles/project.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  // { name: "Shabnam Abaya", img: "./project/img-1.png" },
  { name: "Bluedart Express Dubai", text:"Business Website", img: "./project/blue-dart-express-dubai.png", link: "https://www.bluedartexpress.ae/" },
  { name: "Atelier Vayu", text:"E-commerce Platform", img: "./project/atelier-vayu.png", link: "https://atelier-vayu.vercel.app/" },
  { name: "Ansee Beauty", text:"Human Resources Management", img: "./project/ansee-beauty.png", link: null },
  { name: "Nasar Al Masa", text:"Business Website", img: "./project/nasar-al-masa.png", link: "https://nasar-al-masa.vercel.app/" },
  { name: "Velvet Pour", text:"Mocktail Bar Website", img: "./project/velvet-pour.png", link: "https://valvet-mojito.vercel.app/" },
];

const Spotlight = () => {
  const spotlightRef = useRef(null);
  const projectIndexRef = useRef(null);
  const projectImagesRef = useRef([]);
  const projectNamesRef = useRef([]);
  const scrollTriggerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const setupScrollTrigger = () => {
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
      }

      const spotlightSection = spotlightRef.current;
      const projectIndex = projectIndexRef.current;
      const projectImagesContainer =
        projectImagesRef.current[0]?.parentNode;
      const projectNamesContainer =
        projectNamesRef.current[0]?.parentNode;

      if (!spotlightSection) return;

      const totalProjectCount = projects.length;

      const spotlightHeight = spotlightSection.offsetHeight;
      const paddingTop = parseFloat(
        getComputedStyle(spotlightSection).paddingTop
      );

      const indexHeight = projectIndex.offsetHeight;
      const namesHeight = projectNamesContainer.offsetHeight;
      const imagesHeight = projectImagesContainer.offsetHeight;

      const moveDistanceIndex =
        spotlightHeight - paddingTop * 2 - indexHeight;
      const moveDistanceName =
        spotlightHeight - paddingTop * 2 - namesHeight;
      const moveDistanceImages = window.innerHeight - imagesHeight;

      const imgActivationThreshold = window.innerHeight / 2;

      scrollTriggerRef.current = ScrollTrigger.create({
        trigger: spotlightSection,
        start: "top top",
        end: `+=${window.innerHeight * 5}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,

        onUpdate: (self) => {
          const progress = self.progress;

          const currentIndex = Math.min(
            Math.floor(progress * totalProjectCount) + 1,
            totalProjectCount
          );

          projectIndex.textContent = `${String(currentIndex).padStart(
            2,
            "0"
          )}/${String(totalProjectCount).padStart(2, "0")}`;

          gsap.set(projectIndex, {
            y: progress * moveDistanceIndex,
          });

          gsap.set(projectImagesContainer, {
            y: progress * moveDistanceImages,
          });

          projectImagesRef.current.forEach((img) => {
            const rect = img.getBoundingClientRect();
            gsap.set(img, {
              opacity:
                rect.top <= imgActivationThreshold &&
                rect.bottom >= imgActivationThreshold
                  ? 1
                  : 0.4,
            });
          });

          projectNamesRef.current.forEach((p, i) => {
            const start = i / totalProjectCount;
            const end = (i + 1) / totalProjectCount;
            const localProgress = gsap.utils.clamp(
              0,
              1,
              (progress - start) / (end - start)
            );

            gsap.set(p, {
              y: -localProgress * moveDistanceName,
            });
          });
        },
      });

      ScrollTrigger.refresh();
    };

    setupScrollTrigger();

    window.addEventListener("resize", setupScrollTrigger);

    return () => {
      window.removeEventListener("resize", setupScrollTrigger);
      ScrollTrigger.getAll().forEach((st) => st.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <div id="portfolio" className="spotlight-wrapper">
      <section className="spotlight" ref={spotlightRef}>
        <div className="project-index">
          <h1 ref={projectIndexRef}>01/04</h1>
        </div>

        <div className="project-images">
          {projects.map((project, i) => (
            <div
              className="project-img"
              key={i}
              ref={(el) => (projectImagesRef.current[i] = el)}
            >
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <img src={project.img} alt={project.name} />
              </a>
            </div>
          ))}
        </div>

        <div className="project-names">
          {projects.map((project, i) => (
            <div
              className="project-name-item"
              key={i}
              ref={(el) => (projectNamesRef.current[i] = el)}
            >
              <p>{project.name}</p>
              {/* <span className="project-text">{project.text}</span> */}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Spotlight;