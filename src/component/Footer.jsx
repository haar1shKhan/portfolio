import "../styles/footer.css";
import { LuFacebook, LuInstagram, LuLinkedin } from "react-icons/lu";
import { FaWhatsapp } from "react-icons/fa"; // Use Font Awesome for WhatsApp

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-wrapper">
        <div className="footer-logo">HAARISH KHAN</div>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>

        <div className="footer-socials">
          <a href="https://www.facebook.com/profile.php?id=100004967836172" target="_blank" rel="noopener noreferrer">
            <LuFacebook size={20} />
          </a>
          <a href="https://www.instagram.com/_haarish_khan_/" target="_blank" rel="noopener noreferrer">
            <LuInstagram size={20} />
          </a>
          <a href="https://www.linkedin.com/in/haarish-khan/" target="_blank" rel="noopener noreferrer">
            <LuLinkedin size={20} />
          </a>
          <a href="https://wa.me/971569021105" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={20} />
          </a>
        </div>

        <div className="footer-copy">
          &copy; {new Date().getFullYear()} Haarish Khan. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
