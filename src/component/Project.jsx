import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis"; 
import "../styles/project.css";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { name: "Shabnam Abaya", img: "./project/img-1.png" },
  { name: "Bluedart Express Dubai", img: "./project/img-2.png" },
  { name: "Hr Managament System", img: "./project/img-3.png" },
  { name: "Volunteer - Online Platform", img: "./project/img-4.png" },
];

const Spotlight = () => {
  const spotlightRef = useRef(null);
  const projectIndexRef = useRef(null);
  const projectImagesRef = useRef([]);
  const projectNamesRef = useRef([]);

  useEffect(() => {
    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const spotlightSection = spotlightRef.current;
    const projectIndex = projectIndexRef.current;
    const projectImagesContainer = projectImagesRef.current[0].parentNode;
    const projectNamesContainer = projectNamesRef.current[0].parentNode;

    const totalProjectCount = projects.length;

    const spotlightSectionHeight = spotlightSection.offsetHeight;
    const spotlightSectionPadding = parseFloat(getComputedStyle(spotlightSection).paddingTop);
    const projectIndexHeight = projectIndex.offsetHeight;
    const containerHeight = projectNamesContainer.offsetHeight;
    const imagesHeight = projectImagesContainer.offsetHeight;

    const moveDistanceIndex = spotlightSectionHeight - spotlightSectionPadding * 2 - projectIndexHeight;
    const moveDistanceName = spotlightSectionHeight - spotlightSectionPadding * 2 - containerHeight;
    const moveDistanceImages = window.innerHeight - imagesHeight;

    const imgActivationThreshold = window.innerHeight / 2;

    ScrollTrigger.create({
      trigger: spotlightSection,
      start: "top top",
      end: `+=${window.innerHeight * 5}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const CurrentIndex = Math.min(Math.floor(progress * totalProjectCount), totalProjectCount);
        projectIndex.textContent = `${String(CurrentIndex).padStart(2,"0")}/${String(totalProjectCount).padStart(2,"0")}`;
        gsap.set(projectIndex, { y: progress * moveDistanceIndex });
        gsap.set(projectImagesContainer, { y: progress * moveDistanceImages });

        projectImagesRef.current.forEach((img) => {
          const rect = img.getBoundingClientRect();
          if(rect.top <= imgActivationThreshold && rect.bottom >= imgActivationThreshold){
            gsap.set(img, {opacity:1});
          } else {
            gsap.set(img, {opacity:0.5});
          }
        });

        projectNamesRef.current.forEach((p,index)=>{
          const startProgress = index / totalProjectCount;
          const endProgress = (index+1) / totalProjectCount;
          const projectProgress = Math.max(0, Math.min(1, (progress-startProgress)/(endProgress-startProgress)));
          gsap.set(p, {y: -projectProgress * moveDistanceName});
        });
      }
    });

    return () => ScrollTrigger.getAll().forEach(st => st.kill());

  }, []);

  return (
    <div className="spotlight-wrapper"> {/* wrap to separate layout from services */}

      <section className="spotlight" ref={spotlightRef}>
        <div className="project-index">
          <h1 ref={projectIndexRef}>01/04</h1>
        </div>

        <div className="project-images">
          {projects.map((project,i)=>(
            <div className="project-img" key={i} ref={el => projectImagesRef.current[i]=el}>
              <img src={project.img} alt={project.name}/>
            </div>
          ))}
        </div>

        <div className="project-names">
          {projects.map((project,i)=>(
            <p key={i} ref={el => projectNamesRef.current[i]=el}>{project.name}</p>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Spotlight;
