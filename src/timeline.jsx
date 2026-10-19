
import "./Timeline.css";

const momentos = [
  {
    fecha: "4 de abril de 2025",
    etiqueta: "Aquí comenzó nuestra historia",
    descripcion:
      "El comienzo de una etapa que se convertiría en algo muy especial.",
    tipo: "inicio",
  },
  {
    fecha: "11 de noviembre de 2025",
    etiqueta: "Un capítulo lleno de recuerdos",
    descripcion:
      "Cada momento vivido hasta aquí se convirtió en parte de nuestra historia.",
    tipo: "normal",
  },
  {
    fecha: "5 de julio de 2026",
    etiqueta: "Nuestro primer reencuentro de este año tan pesado",
    descripcion:
      "Nuestro primer reencuentro de este año tan pesado.",
    tipo: "normal",
  },
  {
    fecha: "18 de agosto de 2026",
    etiqueta: "El reencuentro que finalmente nos encaminó a estar juntos otra vez",
    descripcion:
      "El reencuentro que finalmente nos encaminó a estar juntos otra vez.",
    tipo: "normal",
  },
  {
    fecha: "19 de octubre de 2026",
    etiqueta: "Hasta hoy, y lo que nos falta",
    descripcion:
      "Esta historia sigue escribiéndose. Y quiero vivir muchos capítulos más contigo.",
    tipo: "final",
  },
];

export default function Timeline() {
  return (
    <section className="love-timeline" id="nuestra-historia">
      <div className="timeline-heading">
        <span className="timeline-kicker">NUESTRO PEQUEÑO UNIVERSO ✨</span>
        <h2>
          Nuestra historia, <em>en el tiempo</em>
        </h2>
        <p>
          Hay fechas que pasan, y otras que se quedan viviendo en el corazón.
        </p>
      </div>

      <div className="timeline-track">
        {momentos.map((momento, index) => (
          <div
            className={`timeline-item ${
              index % 2 === 0 ? "timeline-left" : "timeline-right"
            }`}
            key={momento.fecha}
          >
            {index === 2 && (
              <div className="timeline-time-jump">
                <span>✦</span>
                Un salto en el tiempo
                <span>✦</span>
              </div>
            )}

            <span className="timeline-dot" aria-hidden="true">
              ♥
            </span>

            <article
              className={`timeline-card timeline-${momento.tipo}`}
            >
              <span className="timeline-date">{momento.fecha}</span>
              <h3>{momento.etiqueta}</h3>
              <p>{momento.descripcion}</p>
              <span className="timeline-sparkle">✧</span>
            </article>
          </div>
        ))}
      </div>

      <p className="timeline-footer">
        Y si pudiera volver a empezar, volvería a elegirte. ♡
      </p>
    </section>
  );
}
