import { useState } from "react";
import "../styles/navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <>     
     <div className="wip-banner">
    <span>🚧 Work in progress — final design and features may change.</span>
  </div>
    <header className="navbar">
      <div className="logo">HAARISH KHAN</div>
      <nav className={`nav-links ${isOpen ? "open" : ""}`}>
        <a href="#home" onClick={() => setIsOpen(false)}>Home</a>
        <a href="#portfolio" onClick={() => setIsOpen(false)}>Portfolio</a>
        <a href="#about" onClick={() => setIsOpen(false)}>About</a>
        <a href="#contact" onClick={() => setIsOpen(false)}>Contact</a>
      </nav>

      <a href="https://wa.me/971569021105" className="btn primary">
        Hire Me
      </a>

      {/* Hamburger Menu */}
      <div className={`hamburger ${isOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>
</>

  );
};

export default Navbar;
