import gsap from "gsap";
import "../styles/hero2.css";
import { useEffect } from "react";

const Hero = () => {


   // Animate service cards
  useEffect(() => {
    const ctx = gsap.context(() => {

    gsap.to(".hero", {
        scale: 0.5,
        rotation: -30,
        duration: 1,
        borderRadius: "20px",
        ease: "sine",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top", // when stats enter viewport
          end: "60% top",
          pin:true,
          scrub: true,
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, []);


  return (
    <section  className="hero">
 

      <div className="hero-content">
      

        <div className="hero-left">
          <h1><span>Creative</span> Developer</h1>

          <h2>Building modern digital experiences</h2>

          <p>I build websites that feel like something.
            Web design & development for brands that want to be remembered.</p>

          <div className="buttons"> 

               <button className="view-projects">View Projects</button>
               <button className="btn">Contact Me</button>  

          </div>


        </div>
        <div className="hero-right">
          <div className="semi-circle-stroke">
           
          </div>

           <div className="semi-circle">
              <img src="/hero-section.png" alt="Hero Image" />
            </div>
        </div>
      

      </div>
    </section>
 
  );
};

export default Hero;