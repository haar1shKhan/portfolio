import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from "./component/Navbar2"
import Hero from "./component/Hero2"
import About from "./component/About2"
import Service from "./component/Service2"
import Project from "./component/Project"
import Contact from './component/Contact2'
import Footer from './component/Footer2'


import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";


gsap.registerPlugin(ScrollTrigger);

function App() {


  // Initialize Lenis for smooth scroll
    useEffect(() => {
      const lenis = new Lenis({
        duration: 1.2, // smooth scroll duration
        easing: (t) => t, // easing function
        smooth: true,
      });
  
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
  
      // Tell ScrollTrigger to update on Lenis scroll
      lenis.on("scroll", ScrollTrigger.update);
  
      // Cleanup
      return () => {
        lenis.destroy();
      };
    }, []);

  return (
    <div>
     <Navbar/>
     <div id="home" style={{backgroundColor: "#E8E0D0",
      // maxHeight: "800px"
      }}>
      <Hero/>
     </div>
     <About/>
     <Service/>
     <div style={{position:"relative"}}>
      <Project/>
     </div>
     <Contact/>
     <Footer/>

    </div>
  )
}

export default App
