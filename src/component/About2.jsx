import React, { useEffect } from 'react'
import '../styles/about2.css'
import gsap from 'gsap';

import { SplitText } from 'gsap/SplitText';

const About = () => {

useEffect(() => {
  const ctx = gsap.context(() => {

    let split = SplitText.create(".split", {
      type: "words",
    });

    let splitp = SplitText.create(".paragraph", {
      type: "lines",
    });

    gsap.from(split.words, {
      y: 100,
      autoAlpha: 0,
      stagger: 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".split",
        start: "top center",
      },
    });


    gsap.from(splitp.lines, {
      y: 100,
      autoAlpha: 0,
      stagger: 0.05,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".paragraph",
        start: "top center",
      },
    });


    

    gsap.from(".desk", {
      scale: 0,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".desk",
        start: "top center",
      },
    });

    gsap.from(".paragraph", {
      y: 50,
      opacity: 0,
      duration: 1,
      scrollTrigger: {
        trigger: ".paragraph",
        start: "top center",
      },
    });

    gsap.from(".stat", {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      scrollTrigger: {
        trigger: ".stats",
        start: "top center",
      },
    });

  });

  return () => ctx.revert();
}, []);

  return (
    <section id="about" className="about ">
      <div className="about-content">
           <h2 className='split'>Anyone can launch a website in an afternoon. 
               Not everyone can make it <span className='accent'>stay</span> in someone's head.</h2>
               <div className="noise">
                <img className="desk noise" src="/desk.png" alt="" />
               </div>
               <p className='paragraph'>
               I'm <b>Haarish</b>, a creative developer who blends thoughtful design with clean code. I build websites that don't just work—they leave an impression.
                Currently open to freelance projects.
               </p>

              <div className="stats">
                {/* Set 1 */}
                <div className="stat"><h3>2+</h3><p>Years Experience</p></div>
                <div className="stat"><h3>20+</h3><p>Projects Completed</p></div>
                <div className="stat"><h3>100%</h3><p>Client Satisfaction</p></div>
              </div>
        </div>
    </section>
  )
}

export default About