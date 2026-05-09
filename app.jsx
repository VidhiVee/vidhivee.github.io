import React, { useRef, useEffect, useState } from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import {
  motion, AnimatePresence,
  useMotionValue, useSpring, useTransform, useScroll
} from "https://esm.sh/framer-motion@10.16.4?deps=react@18.2.0,react-dom@18.2.0";

// ── Scroll progress bar ───────────────────────────────────────────────────────
const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// ── Cursor spotlight ──────────────────────────────────────────────────────────
const CursorSpotlight = () => {
  const [pos, setPos] = useState({ x: -600, y: -600 });

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      className="cursor-spotlight"
      style={{ left: pos.x, top: pos.y }}
    />
  );
};

// ── Magnetic button ───────────────────────────────────────────────────────────
const MagneticButton = ({ children, className, href, onClick, type, style, disabled }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xs = useSpring(x, { stiffness: 280, damping: 18 });
  const ys = useSpring(y, { stiffness: 280, damping: 18 });

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  const shared = {
    ref,
    className,
    style: { ...style, x: xs, y: ys },
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    whileHover: { scale: 1.05 },
    whileTap: { scale: 0.95 },
  };

  if (href) return <motion.a href={href} {...shared}>{children}</motion.a>;

  return (
    <motion.button type={type || "button"} onClick={onClick} disabled={disabled} {...shared}>
      {children}
    </motion.button>
  );
};

// ── 3D Tilt card with glare ───────────────────────────────────────────────────
const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xs = useSpring(x, { stiffness: 140, damping: 18 });
  const ys = useSpring(y, { stiffness: 140, damping: 18 });
  const rotateX = useTransform(ys, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(xs, [-0.5, 0.5], ["-12deg", "12deg"]);
  const glareX = useTransform(xs, [-0.5, 0.5], ["-100%", "100%"]);
  const glareY = useTransform(ys, [-0.5, 0.5], ["-100%", "100%"]);

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateY, rotateX, transformStyle: "preserve-3d" }}
      className={`tilt-card ${className || ""}`}
    >
      <div className="glare-wrapper">
        <motion.div className="glare" style={{ x: glareX, y: glareY }} />
      </div>
      <div className="tilt-card-inner">{children}</div>
    </motion.div>
  );
};

// ── Section heading ───────────────────────────────────────────────────────────
const SectionLabel = ({ label, title }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, filter: "blur(16px)" }}
    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.85, ease: "easeOut" }}
    style={{ marginBottom: "4rem" }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", marginBottom: "0.9rem" }}>
      <div className="section-divider" />
      <span className="section-label-text">{label}</span>
    </div>
    <h2 className="section-title" style={{ marginBottom: 0 }}>{title}</h2>
  </motion.div>
);

// ── Header ────────────────────────────────────────────────────────────────────
const Header = () => {
  const { scrollY } = useScroll();
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (v) => setScrolled(v > 60));
  }, [scrollY]);

  return (
    <motion.header
      className={`header${scrolled ? " header-scrolled" : ""}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.15 }}
    >
      <motion.div
        className="logo"
        whileHover={{ scale: 1.08, rotate: 2 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Vidhi.
      </motion.div>
      <nav className="nav-links">
        {["About", "Experience", "Projects", "Contact"].map((item, i) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="nav-link"
            onMouseEnter={() => setActive(item)}
            onMouseLeave={() => setActive("")}
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08, type: "spring" }}
          >
            {item}
            {active === item && (
              <motion.div
                layoutId="nav-highlight"
                className="nav-highlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.45 }}
              />
            )}
          </motion.a>
        ))}
      </nav>
    </motion.header>
  );
};

// ── Hero ──────────────────────────────────────────────────────────────────────
const Hero = () => {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 800], [0, 200]);
  const fadeOut = useTransform(scrollY, [0, 500], [1, 0]);

  const roles = ["AI/ML Developer", "Software Engineer", "Mitacs Intern", "CS Researcher"];
  const [roleIdx, setRoleIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setRoleIdx((i) => (i + 1) % roles.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.section className="hero" style={{ y: yParallax, opacity: fadeOut }}>
      <div className="container">
        <div className="hero-content">
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          >
            <span className="badge-dot" />
            Available for opportunities
          </motion.div>

          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            Hi, I'm{" "}
            <span className="gradient-text">Vidhi.</span>
            <br />
            I am{" "}
            <span style={{ position: "relative", display: "inline-block", minWidth: "280px" }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={roleIdx}
                  className="gradient-text"
                  initial={{ opacity: 0, y: 32, filter: "blur(12px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -32, filter: "blur(12px)" }}
                  transition={{ duration: 0.52, ease: "easeInOut" }}
                  style={{ display: "inline-block" }}
                >
                  {roles[roleIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            4th Year Student at Algoma University &nbsp;·&nbsp; Mitacs Intern
            &nbsp;·&nbsp; VP & Co-founder of Alcoms
          </motion.p>

          <motion.div
            className="btn-group"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton href="#about" className="btn btn-primary">
              Who I Am
            </MagneticButton>
            <MagneticButton href="#contact" className="btn btn-secondary">
              Contact Me
            </MagneticButton>
          </motion.div>

          <motion.div
            className="scroll-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <motion.div
              className="scroll-line"
              animate={{ scaleY: [0.25, 1, 0.25] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span>Scroll</span>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

// ── About ─────────────────────────────────────────────────────────────────────
const About = () => {
  const techStack = [
    "React", "Python", "TensorFlow", "Node.js",
    "AWS", "SQL", "Scikit-Learn", "Git",
  ];
  const stats = [
    { icon: "🎓", text: "Algoma University, BCS — Dec 2024" },
    { icon: "📍", text: "Sault Ste. Marie / Brampton, Ontario" },
    { icon: "🔬", text: "AI/ML Research & Software Engineering" },
    { icon: "✈️", text: "Mitacs Globalink Research Intern" },
  ];

  return (
    <section id="about" className="section">
      <div className="container">
        <SectionLabel label="About" title="Who I Am" />

        <div className="two-column">
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="about-text" style={{ fontSize: "1.35rem", color: "var(--text-main)", fontWeight: 500 }}>
              Vidhi is a final-year Computer Science student at Algoma University,
              graduating December 2024.
            </p>
            <p className="about-text">
              She co-founded ALCOMS (Algoma University Computer Science Society) and
              serves as its Vice President. Her work spans Machine Learning, Deep
              Neural Networks, system architecture, and organizing massive community
              tech events.
            </p>
            <p className="about-text">
              Research-driven and builder-minded — she writes algorithms and ships
              real, intelligent software.
            </p>

            <motion.div
              className="tech-stack"
              style={{ marginTop: "2.5rem" }}
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {techStack.map((tech, i) => (
                <motion.span
                  key={i}
                  className="tech-tag"
                  variants={{
                    hidden: { opacity: 0, scale: 0.7, y: 12 },
                    visible: { opacity: 1, scale: 1, y: 0 },
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 16 }}
                  whileHover={{ scale: 1.12, y: -3 }}
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard>
              <div className="about-stats">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    className="stat-item"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.55 }}
                    whileHover={{ x: 6 }}
                  >
                    <div className="stat-icon">{stat.icon}</div>
                    <div className="stat-text">{stat.text}</div>
                  </motion.div>
                ))}
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ── Experience ────────────────────────────────────────────────────────────────
const Experience = () => {
  const experiences = [
    {
      role: "Globalink Research Intern",
      company: "Mitacs",
      period: "2024",
      color: "#6366f1",
      desc: "Conducted advanced research, applying machine learning algorithms to complex datasets. Collaborated with international researchers to pioneer new ML paradigms.",
    },
    {
      role: "Vice President & Co-founder",
      company: "Alcoms — CS Society, Algoma U",
      period: "2023 – Present",
      color: "#8b5cf6",
      desc: "Co-founded and currently lead the Computer Science Society at Algoma University. Organizing high-impact events, technical workshops, and fostering a robust developer community.",
    },
    {
      role: "Organizer & Co-Director",
      company: "ThunderHacks",
      period: "2023 – Present",
      color: "#a855f7",
      desc: "Planning, organizing, and executing ThunderHacks, Algoma University's premier hackathon. Scaling the event to engage students in rapid prototyping and innovation.",
    },
    {
      role: "Systems Officer",
      company: "Government of Ontario",
      period: "2022",
      color: "#7c3aed",
      desc: "Provided crucial IT support and systems management. Ensured the reliability, modernization, and security of critical provincial systems infrastructure.",
    },
  ];

  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionLabel label="Experience" title="Experience & Leadership" />

        <div className="timeline">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60, y: 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                type: "spring",
                stiffness: 90,
                damping: 20,
              }}
            >
              <TiltCard className="experience-card">
                <div className="exp-header">
                  <h3 className="timeline-role">{exp.role}</h3>
                  <span className="timeline-period">{exp.period}</span>
                </div>
                <div
                  className="timeline-company"
                  style={{
                    background: `${exp.color}18`,
                    color: exp.color,
                    border: `1px solid ${exp.color}30`,
                  }}
                >
                  {exp.company}
                </div>
                <p className="timeline-desc">{exp.desc}</p>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Projects ──────────────────────────────────────────────────────────────────
const Projects = () => {
  const projects = [
    {
      title: "Medical Insurance AI Predictor",
      desc: "A highly accurate ML system predicting medical premiums across multiple insurers. Utilizes an advanced DNN, LSTM, and Random Forests architecture to minimise prediction error.",
      tech: ["Python", "TensorFlow", "Scikit-Learn", "Keras"],
      icon: "🧠",
      color: "#8b5cf6",
    },
    {
      title: "ThunderHacks Platform",
      desc: "End-to-end hackathon management platform built to streamline registrations, team formation, and project submissions for Algoma University's annual hackathon.",
      tech: ["React", "Node.js", "SQL", "AWS"],
      icon: "⚡",
      color: "#6366f1",
    },
  ];

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionLabel label="Work" title="Featured Projects" />

        <div className="projects-grid">
          {projects.map((proj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60, rotateY: i % 2 === 0 ? -8 : 8 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.85,
                type: "spring",
                damping: 20,
                delay: i * 0.15,
              }}
            >
              <TiltCard className="project-card">
                <div
                  className="project-icon-wrap"
                  style={{ background: `${proj.color}14` }}
                >
                  <span style={{ fontSize: "1.9rem" }}>{proj.icon}</span>
                </div>
                <h3 className="project-title">{proj.title}</h3>
                <p className="project-desc">{proj.desc}</p>
                <div className="tech-stack">
                  {proj.tech.map((t) => (
                    <span key={t} className="tech-tag">{t}</span>
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

// ── Contact ───────────────────────────────────────────────────────────────────
const ContactSection = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("https://formsubmit.co/ajax/vidhi01@algomau.ca", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `Portfolio message from ${formData.name}`,
          _captcha: "false",
          _template: "table",
        }),
      });
      const data = await res.json();
      if (data.success === "true" || data.success === true) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  const contactLinks = [
    {
      label: "Email",
      value: "vidhi01@algomau.ca",
      href: "mailto:vidhi01@algomau.ca",
      icon: <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /></svg>,
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/vidhi-5617192a6",
      href: "https://linkedin.com/in/vidhi-5617192a6",
      icon: <svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
    },
    {
      label: "GitHub",
      value: "github.com/VidhiVee",
      href: "https://github.com/VidhiVee",
      icon: <svg viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,
    },
  ];

  return (
    <section id="contact" className="section" style={{ borderTop: "1px solid var(--glass-border)" }}>
      <div className="container">
        <SectionLabel label="Contact" title="Let's Connect" />

        <motion.p
          className="about-text"
          style={{ marginBottom: "4rem", maxWidth: "600px", marginTop: "-2.5rem" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          Open to software engineering roles, research collaborations, internship
          opportunities, and interesting conversations.
        </motion.p>

        <div className="two-column">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="contact-info-list">
              {contactLinks.map((item, i) => (
                <motion.a
                  key={i}
                  href={item.href}
                  className="contact-info-item"
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.55 }}
                  whileHover={{ x: 8 }}
                >
                  <motion.div
                    className="contact-icon-wrapper"
                    whileHover={{ scale: 1.12, rotate: 6 }}
                  >
                    {item.icon}
                  </motion.div>
                  <div className="contact-details">
                    <h4>{item.label}</h4>
                    <p>{item.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <TiltCard>
              <AnimatePresence mode="wait">
                {status === "success" ? (
                  <motion.div
                    key="success"
                    className="form-success"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 220, damping: 20 }}
                  >
                    <motion.div
                      className="form-success-icon"
                      animate={{ scale: [1, 1.25, 1] }}
                      transition={{ repeat: 2, duration: 0.38 }}
                    >
                      ✅
                    </motion.div>
                    <h3>Message Sent!</h3>
                    <p>Thanks for reaching out — I'll get back to you soon.</p>
                    <MagneticButton
                      className="btn btn-secondary"
                      style={{ marginTop: "1.8rem" }}
                      onClick={() => setStatus("idle")}
                    >
                      Send Another
                    </MagneticButton>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    className="contact-form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          className="form-error-msg"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          Something went wrong. Please email directly at vidhi01@algomau.ca — or try again shortly.
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="form-group">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-input"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Message</label>
                      <textarea
                        name="message"
                        className="form-textarea"
                        placeholder="What's on your mind?"
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <MagneticButton
                      type="submit"
                      className={`btn btn-primary submit-btn${status === "loading" ? " btn-loading" : ""}`}
                      style={{ width: "100%", marginTop: "0.5rem", padding: "1.2rem" }}
                      disabled={status === "loading"}
                    >
                      {status === "loading" ? (
                        <><span className="spinner" />&nbsp; Sending…</>
                      ) : (
                        "Send Message →"
                      )}
                    </MagneticButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </TiltCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// ── Footer ────────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-inner">
        <motion.span
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          whileHover={{ scale: 1.06 }}
        >
          Vidhi.
        </motion.span>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
          © {new Date().getFullYear()} Vidhi. Designed with precision.
        </p>
        <div className="footer-links">
          {["About", "Experience", "Projects", "Contact"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="footer-link">
              {item}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ── App ───────────────────────────────────────────────────────────────────────
const App = () => (
  <>
    <ScrollProgress />
    <CursorSpotlight />
    <div className="bg-orb orb-1" />
    <div className="bg-orb orb-2" />
    <div className="bg-orb orb-3" />
    <Header />
    <main>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <ContactSection />
    </main>
    <Footer />
  </>
);

createRoot(document.getElementById("root")).render(<App />);
