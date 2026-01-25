import "../styles/contact.css";

const Contact = () => {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-wrapper">
        <h2>Contact Me</h2>
        <p>
          I’m open to new projects and collaborations. Let’s build something
          amazing together!
        </p>

        <div className="contact-actions">
          <a
            href="https://wa.me/971569021105"
            target="_blank"
            rel="noopener noreferrer"
            className="btn primary"
          >
            Contact Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default Contact;
