import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown, ArrowLeft, ArrowUpRight, Check, ChevronDown, Clock3,
  Gift, Heart, Mail, Music2, Sparkles, Star, X
} from "lucide-react";
import "./style.css";
import Timeline from "./timeline";

const CONFIG = {
  recipient: "Mi niña hermosa",
  sender: "Tu programador favorito",
  anniversaryDate: "2025-04-11", // Nuestra fecha especial
  dedication: "Mi niña hermosa, este pequeño mundo es solo para ti.",
  photos: [
    { src: "/recuerdo-abrazo.jpg", caption: "Un abrazo que quisiera guardar para siempre" },
    { src: "/recuerdo-beso.jpg", caption: "Mi lugar favorito siempre será cerquita de ti" },
    { src: "/recuerdo-cancha.jpg", caption: "Tú y yo, creando recuerdos bonitos" }
  ]
};

const reasons = [
  ["Tu sonrisa", "Porque hay sonrisas que pueden cambiar el ambiente de un día entero."],
  ["Tu esencia", "Porque no necesitas parecerte a nadie para tener algo especial."],
  ["Tu manera de ser", "Porque los detalles de tu personalidad son parte de lo que te hace única."],
  ["Tus ocurrencias", "Porque una conversación sencilla puede terminar siendo la mejor parte del día."],
  ["Tu mirada", "Porque hay detalles que se quedan en la memoria sin pedir permiso."],
  ["Tu compañía", "Porque compartir tiempo con alguien especial vuelve bonito lo cotidiano."],
  ["Tus pequeños detalles", "Porque las cosas que parecen pequeñas pueden tener un significado enorme."],
  ["Simplemente tú", "Porque no hace falta una lista perfecta para explicar por qué alguien es especial."]
];

const surprises = [
  { title: "Un pequeño secreto", icon: Mail, message: "Si pudiera guardar una emoción en una cajita, guardaría esta alegría de poder dedicarte algo tan especial." },
  { title: "Una estrella para ti", icon: Star, message: "Incluso entre millones de estrellas, me gusta que este pequeño universo tenga tu nombre." },
  { title: "Un latido", icon: Heart, message: "Este corazón es pequeño, pero la intención detrás de este regalo es enorme." },
  { title: "Tu regalo sorpresa", icon: Gift, message: "Sorpresa, mi niña hermosa. Espero haberte sacado una sonrisa. Feliz mes. ❤️" }
];

function Starscape() {
  const stars = useMemo(() => Array.from({ length: 85 }, (_, i) => ({
    id: i, left: `${(i * 37.17) % 100}%`, top: `${(i * 61.31) % 100}%`,
    delay: `${(i % 9) * 0.43}s`, duration: `${2.5 + (i % 5) * 0.65}s`,
    size: i % 8 === 0 ? 3 : 1.5
  })), []);
  return <div className="starscape" aria-hidden="true">
    {stars.map(s => <i key={s.id} style={{ left:s.left, top:s.top, animationDelay:s.delay, animationDuration:s.duration, width:s.size, height:s.size }} />)}
    <div className="nebula nebula-one" /><div className="nebula nebula-two" />
  </div>;
}

function SectionHeading({ eyebrow, title, subtitle }) {
  return <motion.div className="section-heading" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7 }}>
    <span className="eyebrow"><Sparkles size={13} /> {eyebrow}</span>
    <h2>{title}</h2>
    {subtitle && <p>{subtitle}</p>}
  </motion.div>;
}

function App() {
  const [entered, setEntered] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [flipped, setFlipped] = useState({});
  const [surprise, setSurprise] = useState(null);
  const [date, setDate] = useState(() => {
    try { return localStorage.getItem("mi-nina-hermosa-anniversary-date") || CONFIG.anniversaryDate; }
    catch { return CONFIG.anniversaryDate; }
  });
  const [dateEditor, setDateEditor] = useState(false);
  const [finalOpen, setFinalOpen] = useState(false);
  const [musicOn, setMusicOn] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(null);

  // Avioncito que acompaña el movimiento del cursor en escritorio.
  useEffect(() => {
    const cursor = document.querySelector(".snoopy-cursor");
    if (!cursor) return;
    const move = (event) => {
      cursor.style.transform = `translate3d(${event.clientX + 12}px, ${event.clientY + 8}px, 0)`;
      cursor.classList.add("is-visible");
    };
    const hide = () => cursor.classList.remove("is-visible");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    if (!date) { setElapsed(null); return; }
    const start = new Date(`${date}T00:00:00`);
    if (Number.isNaN(start.getTime()) || start > new Date()) { setElapsed(null); return; }
    const update = () => {
      let seconds = Math.max(0, Math.floor((Date.now() - start.getTime()) / 1000));
      const days = Math.floor(seconds / 86400); seconds %= 86400;
      const hours = Math.floor(seconds / 3600); seconds %= 3600;
      const minutes = Math.floor(seconds / 60); seconds %= 60;
      setElapsed({ days, hours, minutes, seconds });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [date]);

  useEffect(() => {
    if (!surprise && !finalOpen) return;
    const onKey = e => { if (e.key === "Escape") { setSurprise(null); setFinalOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [surprise, finalOpen]);

  const saveDate = value => {
    setDate(value);
    try { localStorage.setItem("mi-nina-hermosa-anniversary-date", value); } catch {}
    setDateEditor(false);
  };
  const goTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return <div className="app-shell">
    <img className="snoopy-cursor" src="/snoopy-plane-transparent.png" alt="" aria-hidden="true" />
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
    <div className="cartoon-background" aria-hidden="true" />
    <Starscape />

    <AnimatePresence>
      {!entered && <motion.div className="intro-screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }} transition={{ duration: 1 }}>
        <Starscape />
        <motion.div className="intro-content" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }}>
          <div className="orbit-heart"><span /><Heart size={34} strokeWidth={1.2} /></div>
          <span className="eyebrow">PARA MI NIÑA HERMOSA</span>
          <h1>Mi mundo es más bonito<br /><em>cuando estás</em> <span>tú.</span></h1>
          <p>Con todo el amor de mi corazón<br className="desktop-only" /> solamente para ti.</p>
          <button className="primary-button" onClick={() => setEntered(true)}>Toca para entrar a nuestro mundo <ArrowUpRight size={17} /></button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>

    <header className="topbar">
      <button className="wordmark" onClick={() => goTo("home")} aria-label="Volver al inicio"><span className="wordmark-icon">✦</span> para mi niña hermosa</button>
      <nav>
        <button onClick={() => goTo("letter")}>La carta</button>
        <button onClick={() => goTo("reasons")}>Pequeños detalles</button>
        <button onClick={() => goTo("memories")}>Recuerdos</button>
      </nav>
      <button className="music-button" onClick={async () => {
        const audio = document.getElementById("our-song");
        if (!audio) return;
        if (musicOn) { audio.pause(); setMusicOn(false); }
        else { try { await audio.play(); setMusicOn(true); } catch { setMusicOn(false); } }
      }} title="Reproducir o pausar nuestra canción" aria-pressed={musicOn}>
        <Music2 size={16} /><span>{musicOn ? "Pausar canción" : "Nuestra canción"}</span>
      </button>
      <audio id="our-song" src="/aquel-napzzzz-fragmento.mp3" preload="none" />
    </header>

    <main>
      <section className="hero section-wrap" id="home">
        <motion.div className="hero-copy" initial={{ opacity: 0, y: 25 }} animate={entered ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }} transition={{ duration: .9, delay: entered ? .25 : 0 }}>
          <span className="eyebrow"><span className="eyebrow-dot" /> UN PEQUEÑO MUNDO PARA MI NIÑA HERMOSA</span>
          <h1>Hay personas que<br />hacen que todo se<br /><em>sienta diferente.</em></h1>
          <p className="hero-description">Y hoy quería recordarte que tú eres una de esas personas, mi niña hermosa. Así que preparé algo que no se encuentra en ninguna tienda: un pequeño rincón hecho pensando en ti.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => goTo("letter")}>Hay algo para ti <Heart size={16} /></button>
            <button className="text-button" onClick={() => goTo("reasons")}>Explorar el universo <ArrowDown size={15} /></button>
          </div>
          <div className="signature-note"><span className="signature-line" /> <span>Creado especialmente para <strong>mi niña hermosa</strong></span></div>
        </motion.div>
        <motion.div className="hero-art" initial={{ opacity: 0, scale: .88 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, delay: .2 }}>
          <div className="art-orbit orbit-a" /><div className="art-orbit orbit-b" /><div className="art-orbit orbit-c" />
          <div className="art-glow" />
          <div className="hero-heart"><Heart size={91} strokeWidth={.8} fill="url(#heartFill)" /><svg width="0" height="0"><defs><linearGradient id="heartFill" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffb6d1"/><stop offset="1" stopColor="#8f315b"/></linearGradient></defs></svg></div>
          <span className="floating-word word-one">mi lugar favorito</span>
          <span className="floating-word word-two">✦ contigo ✦</span>
          <span className="art-star star-a">✧</span><span className="art-star star-b">✦</span><span className="art-star star-c">✧</span>
          <div className="art-caption"><span>01 / 04</span><span>un detalle, mil sentimientos</span></div>
        </motion.div>
        <button className="scroll-cue" onClick={() => goTo("letter")} aria-label="Bajar a la carta"><span /> DESLIZA PARA DESCUBRIR <ChevronDown size={14} /></button>
      </section>

      <section className="letter-section section-wrap" id="letter">
        <SectionHeading eyebrow="UNAS PALABRAS PARA TI" title={<>Algo que quería<br /><em>decirte hace tiempo.</em></>} subtitle="No es una carta cualquiera. Es un pequeño pedacito de lo que quería expresarte." />
        <div className={`letter-stage ${letterOpen ? "is-open" : ""}`}>
          <AnimatePresence mode="wait">
            {!letterOpen ? <motion.button key="envelope" className="envelope" onClick={() => setLetterOpen(true)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} exit={{ opacity: 0, y: -15, scale: .96 }} aria-label="Abrir carta para mi niña hermosa">
              <div className="envelope-back" /><div className="envelope-paper"><span className="paper-label">UNA CARTA PARA</span><strong>Mi niña hermosa</strong><span className="paper-heart">♡</span></div><div className="envelope-flap" /><div className="envelope-seal"><Heart size={20} fill="currentColor" /></div>
              <span className="envelope-hint">Toca para abrir tu carta <ArrowUpRight size={14} /></span>
            </motion.button> : <motion.article key="letter" className="letter-paper" initial={{ opacity: 0, y: 20, rotateX: -7 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: .65 }}>
              <div className="letter-decoration">✦</div>
              <h3>Para la niña que hace<br /><em>mis días diferentes.</em></h3>
              <p>Sofi, mi niña linda, mientras trabajaba no hacia mas que pensar en ti y se me vino a la mente darte algo especial propio de mi, quiza no es algo que puedas conservar a tu lado, ver o quiza abrazar, sin embargo con todo el cariño del mundo hice este rincon para recordarnos.</p>
              <p>Eres de las personas mas bonitas y bellas que han entrado en mi vida, y sin importar que pasado tengamos, que hayamos tenido que atravesar y que momentos hemos pasado, eres la persona a la que amo y una de las mas especiales de mi vida, ojala y esta pagina te pueda hacer recordar todos esos momentos y lo bonita y feliz que me pones al tener la virtud de dedicarte algo asi.</p>
              <p>Gracias por ser tú, por tu forma de ver el mundo y por hacer que incluso las cosas sencillas puedan sentirse especiales. Este regalo es pequeño comparado con todo lo que quisiera expresar, pero está hecho con muchísimo cariño.</p>
              <p className="letter-ending">Disfruta mucho, mi niña hermosa. <span>♥</span></p>
              <div className="letter-signature">Con cariño,<br /><em>{CONFIG.sender}</em></div>
              <div className="letter-bottom"><span>HECHO CON AMOR</span><span>✦</span><span>SOLO PARA TI</span></div>
            </motion.article>}
          </AnimatePresence>
        </div>
      </section>

      <section className="reasons-section section-wrap" id="reasons">
        <SectionHeading eyebrow="OCHO PEQUEÑOS RECORDATORIOS" title={<>No necesitas una razón<br />para ser <em>especial.</em></>} subtitle="Pero por si algún día se te olvida, aquí tienes algunas. Toca cada tarjeta." />
        <div className="reasons-grid">
          {reasons.map(([title, text], i) => <motion.button className={`reason-card ${flipped[i] ? "flipped" : ""}`} key={title} onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .45, delay: (i % 4) * .07 }} aria-pressed={!!flipped[i]}>
            <span className="reason-number">0{i + 1}</span>
            <span className="reason-icon">{["✧","♡","✦","☾","✷","∞","❋","♥"][i]}</span>
            <span className="reason-card-title">{flipped[i] ? text : title}</span>
            <span className="reason-bottom">{flipped[i] ? "Toca para volver" : "DESCUBRIR"} <ArrowUpRight size={13} /></span>
          </motion.button>)}
        </div>
      </section>

      <section className="surprises-section section-wrap" id="surprises">
        <SectionHeading eyebrow="PEQUEÑAS SORPRESAS" title={<>Abre esto cuando<br /><em>quieras sonreír.</em></>} subtitle="Hay cuatro pequeños detalles escondidos aquí. ¿Te animas a descubrirlos?" />
        <div className="surprises-grid">
          {surprises.map((item, i) => {
            const Icon = item.icon;
            return <motion.button className="surprise-card" key={item.title} onClick={() => setSurprise(item)} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .1 }}>
              <span className={`surprise-icon surprise-icon-${i}`}><Icon size={26} strokeWidth={1.4} /></span>
              <span className="surprise-title">{item.title}</span>
              <span className="surprise-cta">TOCA PARA ABRIR <ArrowUpRight size={13} /></span>
            </motion.button>;
          })}
        </div>
      </section>

      <section className="wish-section section-wrap">
        <div className="wish-glow" />
        <SectionHeading eyebrow="SI PUDIERA REGALARTE ALGO MÁS" title={<>Te regalaría cosas<br />que no caben en <em>una caja.</em></>} />
        <div className="wish-list">
        </div>
        <Timeline />
        <p className="wish-closing">Como no puedo guardar todos esos momentos en una caja,<br className="desktop-only" /> hoy quise regalarte este pequeño universo.</p>
      </section>

      <section className="time-section section-wrap" id="time">
        <div className="time-card">
          <div className="time-decoration"><Clock3 size={19} /><span>EL TIEMPO COMPARTIDO</span></div>
          <SectionHeading eyebrow="CADA INSTANTE CUENTA" title={<>Un tiempo que se vuelve<br /><em>parte de la historia.</em></>} subtitle="No se trata de contar el tiempo, sino de darle significado." />
          {elapsed ? <div className="counter-grid">
            {[["DÍAS", elapsed.days], ["HORAS", elapsed.hours], ["MINUTOS", elapsed.minutes], ["SEGUNDOS", elapsed.seconds]].map(([label, val]) => <div className="counter-unit" key={label}><strong>{String(val).padStart(2,"0")}</strong><span>{label}</span></div>)}
          </div> : <div className="date-prompt"><p>Una fecha especial merece su propio lugar aquí.</p><button className="outline-button" onClick={() => setDateEditor(v => !v)}>{dateEditor ? "Cerrar" : "Añadir nuestra fecha"} <ArrowUpRight size={15} /></button>
            {dateEditor && <form className="date-form" onSubmit={e => { e.preventDefault(); saveDate(e.currentTarget.elements.anniversary.value); }}><label htmlFor="anniversary">¿Qué día empezó esta historia?</label><input id="anniversary" name="anniversary" type="date" required max={new Date().toISOString().slice(0,10)} defaultValue={date} /><button className="primary-button" type="submit">Guardar fecha <Check size={15} /></button></form>}
          </div>}
          {elapsed && <button className="change-date" onClick={() => setDateEditor(v => !v)}>{dateEditor ? "Cancelar" : "Editar fecha de inicio"}</button>}
          {elapsed && dateEditor && <form className="date-form" onSubmit={e => { e.preventDefault(); saveDate(e.currentTarget.elements.anniversary.value); }}><label htmlFor="anniversary-edit">Nueva fecha</label><input id="anniversary-edit" name="anniversary" type="date" required max={new Date().toISOString().slice(0,10)} defaultValue={date} /><button className="primary-button" type="submit">Actualizar <Check size={15} /></button></form>}
        </div>
      </section>

      <section className="memories-section section-wrap" id="memories">
        <SectionHeading eyebrow="UN ESPACIO PARA NUESTRA HISTORIA" title={<>Momentos que merecen<br /><em>quedarse cerquita.</em></>} subtitle="Este espacio está esperando esas fotos que cuentan más que mil palabras." />
        <div className="memories-grid">
          {CONFIG.photos.map((photo, i) => <motion.button className={`memory-card memory-${i}`} key={i} onClick={() => setSurprise({ title: "Un recuerdo para guardar", message: "Puedes personalizar esta tarjeta agregando una fotografía tuya en el archivo src/main.jsx, dentro de CONFIG.photos." })} whileHover={{ y: -5, rotate: i === 1 ? 1 : -1 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .12 }}>
            {photo.src ? <img src={photo.src} alt={photo.caption} /> : <div className="memory-placeholder"><span>{["✧", "♡", "✦"][i]}</span><small>UN LUGAR PARA UN RECUERDO</small></div>}
            <span className="memory-caption">{photo.caption}</span><span className="memory-tape" />
          </motion.button>)}
        </div>
        <p className="gallery-note">Psst… puedes reemplazar estos espacios por tus propias fotografías en el código. ♡</p>
      </section>

      <section className="question-section section-wrap" id="question">
        <div className="question-halo"><Heart size={35} strokeWidth={1.1} /></div>
        <span className="eyebrow">ANTES DE QUE TE VAYAS</span>
        <h2>Quiero preguntarte<br /><em>algo, mi niña hermosa...</em></h2>
        <p>¿Me dejarías seguir creando momentos bonitos contigo?</p>
        <button className="primary-button question-button" onClick={() => setFinalOpen(true)}>Claro que sí <Heart size={16} /></button>
        <span className="question-foot">HECHO CON CARIÑO, SIN PRISAS Y SOLO PARA TI</span>
      </section>

      <footer className="footer section-wrap">
        <div className="footer-star">✦</div>
        <p className="eyebrow">Y SIEMPRE RECUERDA</p>
        <h2>De todos los lugares posibles,<br /><em>qué bonito coincidir.</em></h2>
        <p className="footer-copy">Feliz mes, mi niña hermosa.<br />Este pequeño universo lleva tu nombre, mi niña hermosa. <span>♥</span></p>
        <button className="text-button" onClick={() => goTo("home")}><ArrowLeft size={15} /> Volver a empezar</button>
        <div className="footer-bottom"><span>HECHO CON ♥</span><span>PARA MI NIÑA HERMOSA · CON CARIÑO</span><span>✦ 2026</span></div>
      </footer>
    </main>

    <AnimatePresence>
      {surprise && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSurprise(null)}>
        <motion.div className="surprise-modal" role="dialog" aria-modal="true" aria-label={surprise.title} initial={{ opacity: 0, scale: .88, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: .94, y: 10 }} onClick={e => e.stopPropagation()}>
          <button className="modal-close icon-button" onClick={() => setSurprise(null)} aria-label="Cerrar"><X size={18} /></button>
          <div className="modal-sparkle"><Sparkles size={25} /></div><span className="eyebrow">UNA SORPRESA PARA TI</span><h3>{surprise.title}</h3><p>{surprise.message}</p><div className="modal-heart">♥</div><button className="outline-button" onClick={() => setSurprise(null)}>Guardar en el corazón <Heart size={15} /></button>
        </motion.div>
      </motion.div>}
      {finalOpen && <motion.div className="modal-backdrop final-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFinalOpen(false)}>
        <motion.div className="final-modal" role="dialog" aria-modal="true" aria-label="Una última dedicatoria" initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: .94 }} onClick={e => e.stopPropagation()}>
          <button className="modal-close icon-button" onClick={() => setFinalOpen(false)} aria-label="Cerrar"><X size={18} /></button>
          <div className="final-heart"><Heart size={44} fill="currentColor" strokeWidth={1} /></div><span className="eyebrow">UN PEQUEÑO DESEO</span><h3>Que nunca nos falten<br /><em>momentos bonitos.</em></h3><p>Gracias por llegar hasta aquí, mi niña hermosa. Ojalá este detalle te haya regalado una sonrisa y te recuerde lo especial que eres.</p><div className="confetti-row">✦　♡　✧　♥　✧　♡　✦</div><button className="primary-button" onClick={() => { setFinalOpen(false); goTo("home"); }}>Volver a nuestro universo <ArrowUpRight size={16} /></button>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
    {musicOn && <div className="ambient-toast"><span className="pulse-dot" /> Sonando para ustedes. <button onClick={() => { const audio = document.getElementById("our-song"); audio?.pause(); setMusicOn(false); }} aria-label="Pausar canción"><X size={13} /></button><small>Fragmento desde 3:53 hasta el final.</small></div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<React.StrictMode><App /></React.StrictMode>);