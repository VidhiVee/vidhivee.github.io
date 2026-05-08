import React, { useRef, useEffect } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "https://esm.sh/framer-motion@10.16.4?deps=react@18.2.0,react-dom@18.2.0";

// 3D Tilt Card with Glare
const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Spring configurations for ultra-smooth 3D tracking
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // 3D Rotations
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  
  // Glare Translations
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "100%"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`tilt-card ${className || ""}`}
    >
      <div className="glare-wrapper">
        <motion.div 
          className="glare" 
          style={{ x: glareX, y: glareY }}
        />
      </div>
      <div className="tilt-card-inner">
        {children}
      </div>
    </motion.div>
  );
};

const Header = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 100], [1, 0.9]);
  const [active, setActive] = React.useState("");
  
  return (
    <motion.header 
      className="header"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      style={{ opacity }}
    >
      <motion.div 
        className="logo"
        style={{ marginRight: '1.5rem', cursor: 'pointer' }}
        whileHover={{ scale: 1.1, rotate: 2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.scrollTo(0,0)}
      >
        Vidhi.
      </motion.div>
      <nav className="nav-links">
        {["Experience", "Projects", "Contact"].map((item, i) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="nav-link"
            onMouseEnter={() => setActive(item)}
            onMouseLeave={() => setActive("")}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (i * 0.1), type: "spring" }}
          >
            {item}
            {active === item && (
              <motion.div
                layoutId="nav-highlight"
                className="nav-highlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.a>
        ))}
      </nav>
    </motion.header>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);

  return (
    <motion.section 
      className="hero"
      style={{ y: y1, opacity }}
    >
      <div className="container">
        <div className="hero-content">
          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Hi, I'm <span>Vidhi.</span><br/>
            I build intelligent solutions.
          </motion.h1>
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            IT Professional & AI/ML Developer. 4th Year Student at Algoma University | Mitacs Intern | VP & Co-founder of Alcoms.
          </motion.p>
          <motion.div 
            className="btn-group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <a href="#projects" className="btn btn-primary">
              Explore Projects
            </a>
            <a href="#contact" className="btn btn-secondary">
              Contact Me
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

const Experience = () => {
  const experiences = [
    {
      role: "Globalink Research Intern",
      company: "Mitacs",
      desc: "Conducted advanced research, applying machine learning algorithms to complex datasets. Collaborated with international researchers to pioneer new ML paradigms."
    },
    {
      role: "Vice President & Co-founder",
      company: "Alcoms (CS Society, Algoma U)",
      desc: "Co-founded and currently lead the Computer Science Society at Algoma University. Organizing high-impact events, technical workshops, and fostering a robust developer community."
    },
    {
      role: "Organizer & Co-Director",
      company: "ThunderHacks",
      desc: "Planning, organizing, and executing ThunderHacks, Algoma University's premier hackathon. Scaling the event to engage students in rapid prototyping and innovation."
    },
    {
      role: "Systems Officer",
      company: "Government of Ontario",
      desc: "Provided crucial IT support and systems management. Ensured the reliability, modernization, and security of critical provincial systems infrastructure."
    }
  ];

  return (
    <section id="experience" className="section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, filter: "blur(20px)", y: 50 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          Experience & Leadership
        </motion.h2>
        
        <div className="timeline">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80, rotateX: 30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.15, type: "spring", stiffness: 100, damping: 20 }}
            >
              <TiltCard>
                <h3 className="timeline-role">{exp.role}</h3>
                <div className="timeline-company">{exp.company}</div>
                <p className="timeline-desc">{exp.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const projects = [
    {
      title: "Medical Insurance AI Predictor",
      desc: "A highly accurate ML system predicting medical premiums across multiple insurers. Utilizes an advanced DNN, LSTM, and Random Forests architecture to minimize prediction error.",
      tech: ["Python", "TensorFlow", "Scikit-Learn", "Keras"]
    }
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
          whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring", bounce: 0.4 }}
        >
          Featured Work
        </motion.h2>

        <div className="projects-grid">
          {projects.map((proj, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, rotateY: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, type: "spring", damping: 20, delay: index * 0.2 }}
            >
              <TiltCard>
                <h3 className="project-title">{proj.title}</h3>
                <p className="project-desc">{proj.desc}</p>
                <div className="tech-stack">
                  {proj.tech.map(tech => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, type: "spring" }}
        >
          <div className="social-links">
            <a href="https://github.com/VidhiVee" target="_blank" rel="noreferrer" className="social-link" aria-label="GitHub">
              <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/vidhi-5617192a6/" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="mailto:vidhi01@algomau.ca" className="social-link" aria-label="Email">
              <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </a>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", letterSpacing: "1px" }}>
            © {new Date().getFullYear()} Vidhi. Designed with precision.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

const App = () => {
  return (
    <>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <Header />
      <main>
        <Hero />
        <Experience />
        <Projects />
      </main>
      <Footer />
    </>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);
