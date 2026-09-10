import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  profile,
  skills,
  projects,
  experience,
  cvUrl,
  cvFilename,
  stats,
  methodology,
  methodologyIntro,
  certifications,
  education,
  languages,
  linkedinUrl,
} from '../lib/data'
import { getAnswer, suggestions } from '../lib/faq'
import { notifyCvDownload, notifyCvEmailOptIn } from '../lib/notify'
import styles from '../styles/Home.module.css'

function ThemeToggle() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const stored = document.documentElement.getAttribute('data-theme')
    setTheme(stored === 'light' ? 'light' : 'dark')
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    if (next === 'light') {
      document.documentElement.setAttribute('data-theme', 'light')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
    localStorage.setItem('theme', next)
  }

  return (
    <button
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={theme === 'dark' ? 'Tema claro' : 'Tema oscuro'}
    >
      {theme === 'dark' ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
        </svg>
      )}
    </button>
  )
}

function Reveal({ children, className }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.12 }
    )
    io.observe(el)

    // Safety net: never leave content permanently invisible if the
    // observer misbehaves (fail open, not closed).
    const fallback = setTimeout(() => setVisible(true), 2500)

    return () => {
      io.disconnect()
      clearTimeout(fallback)
    }
  }, [])

  return (
    <div ref={ref} className={`${styles.reveal} ${visible ? styles.revealVisible : ''} ${className || ''}`}>
      {children}
    </div>
  )
}

const ICON_PROPS = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

const METHOD_ICONS = [
  <svg key="search" {...ICON_PROPS}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>,
  <svg key="database" {...ICON_PROPS}><ellipse cx="12" cy="6" rx="8" ry="3" /><path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" /><path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" /></svg>,
  <svg key="gear" {...ICON_PROPS}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
  <svg key="trending" {...ICON_PROPS}><path d="M23 6l-9.5 9.5-5-5L1 18" /><path d="M17 6h6v6" /></svg>,
]

const STATUS_CLASS = {
  'En uso': 'statusLive',
  'Terminado': 'statusDone',
  'En progreso': 'statusProgress',
}

function StatusPill({ status }) {
  return <span className={`${styles.statusPill} ${styles[STATUS_CLASS[status] || 'statusDone']}`}>{status}</span>
}

const MONTH_LABELS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function GithubActivity() {
  const [data, setData] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`https://github-contributions-api.jogruber.de/v4/${profile.github}?y=last`)
      .then((r) => {
        if (!r.ok) throw new Error('bad response')
        return r.json()
      })
      .then((d) => {
        if (!cancelled) setData(d)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  if (failed || !data || !data.contributions) return null

  const days = data.contributions
  const leadingBlanks = new Date(`${days[0].date}T00:00:00`).getDay()
  const cells = [...Array(leadingBlanks).fill(null), ...days]
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  let lastMonth = -1

  return (
    <div className={styles.terminal}>
      <div className={styles.terminalBar}>
        <span className={styles.terminalDot} style={{ background: '#f87171' }} />
        <span className={styles.terminalDot} style={{ background: '#fbbf24' }} />
        <span className={styles.terminalDot} style={{ background: '#4ade80' }} />
        <span className={styles.windowLabel}>jorge@bi ~ actividad.sql</span>
      </div>
      <div className={styles.windowPad}>
        <p className={styles.promptLine}>
          <span className={styles.sign}>jorge@bi=#</span>
          <span className={styles.terminalKw}>SELECT COUNT</span>(*) <span className={styles.terminalKw}>FROM </span>contribuciones <span className={styles.terminalKw}>WHERE </span>fecha &gt;= <span className={styles.terminalStr}>&apos;hace 1 año&apos;</span>;
        </p>
        <p className={styles.ghTotal}>{data.total?.lastYear ?? 0} contribuciones en el último año, en vivo desde GitHub</p>
        <div className={styles.ghGraph}>
          <div className={styles.ghMonths}>
            {weeks.map((week, i) => {
              const firstReal = week.find((d) => d)
              if (!firstReal) return <span key={i} className={styles.ghMonthLabel} />
              const m = new Date(`${firstReal.date}T00:00:00`).getMonth()
              const label = m !== lastMonth ? MONTH_LABELS[m] : ''
              lastMonth = m
              return (
                <span key={i} className={styles.ghMonthLabel}>{label}</span>
              )
            })}
          </div>
          <div className={styles.ghWeeks}>
            {weeks.map((week, wi) => (
              <div key={wi} className={styles.ghWeekCol}>
                {week.map((day, di) => (
                  <span
                    key={di}
                    className={styles.ghDay}
                    data-level={day ? day.level : -1}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.ghLegend}>
          <span>Menos</span>
          <span className={styles.ghDay} data-level={0} />
          <span className={styles.ghDay} data-level={1} />
          <span className={styles.ghDay} data-level={2} />
          <span className={styles.ghDay} data-level={3} />
          <span className={styles.ghDay} data-level={4} />
          <span>Más</span>
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ kicker, title, intro }) {
  return (
    <div>
      <span className={styles.eyebrow}>{kicker}</span>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {intro && <p className={styles.sectionIntro}>{intro}</p>}
    </div>
  )
}

function ProjectDetailBody({ project }) {
  return (
    <>
      <p className={styles.projectDesc}>{project.description}</p>
      <div className={styles.projectTech}>
        {project.tech.map((t) => (
          <span key={t} className={styles.tag}>{t}</span>
        ))}
      </div>
      {project.problem && (
        <div className={styles.projectDetailBlock}>
          <span className={styles.projectDetailLabel}>Problema</span>
          <p>{project.problem}</p>
        </div>
      )}
      {project.approach && (
        <div className={styles.projectDetailBlock}>
          <span className={styles.projectDetailLabel}>Enfoque</span>
          {Array.isArray(project.approach) ? (
            <ul className={styles.detailList}>
              {project.approach.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : (
            <p>{project.approach}</p>
          )}
        </div>
      )}
      {project.url && (
        <a href={project.url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
          Ver proyecto
        </a>
      )}
    </>
  )
}

function ProjectModal({ project, onClose }) {
  const [imgIndex, setImgIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const images = project.images || []

  useEffect(() => {
    setMounted(true)
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') {
        if (fullscreen) setFullscreen(false)
        else onClose()
      }
      if (e.key === 'ArrowRight') setImgIndex((i) => Math.min(i + 1, images.length - 1))
      if (e.key === 'ArrowLeft') setImgIndex((i) => Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [images.length, onClose, fullscreen])

  if (!mounted) return null

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose} role="dialog" aria-modal="true" aria-label={project.name}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.modalClose} onClick={onClose} aria-label="Cerrar">×</button>

        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{project.name}</h3>
          <StatusPill status={project.status} />
        </div>

        {images.length > 0 && (
          <div className={styles.modalGallery}>
            <div className={styles.modalMainImage}>
              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.modalNav} ${styles.modalNavPrev}`}
                  onClick={() => setImgIndex((i) => (i - 1 + images.length) % images.length)}
                  aria-label="Captura anterior"
                >
                  ‹
                </button>
              )}
              <img
                src={images[imgIndex]}
                alt={`${project.name} — captura ${imgIndex + 1}`}
                onClick={() => setFullscreen(true)}
                className={styles.zoomable}
              />
              {images.length > 1 && (
                <button
                  type="button"
                  className={`${styles.modalNav} ${styles.modalNavNext}`}
                  onClick={() => setImgIndex((i) => (i + 1) % images.length)}
                  aria-label="Captura siguiente"
                >
                  ›
                </button>
              )}
              {images.length > 1 && (
                <span className={styles.modalCounter}>{imgIndex + 1} / {images.length}</span>
              )}
            </div>
            {images.length > 1 && (
              <div className={styles.modalThumbs}>
                {images.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`${styles.modalThumb} ${i === imgIndex ? styles.modalThumbActive : ''}`}
                    onClick={() => setImgIndex(i)}
                    aria-label={`Ver captura ${i + 1}`}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className={styles.modalBody}>
          <ProjectDetailBody project={project} />
        </div>
      </div>

      {fullscreen && images.length > 0 && (
        <div
          className={styles.imageFullscreen}
          onClick={() => setFullscreen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.name} — captura ampliada`}
        >
          <img src={images[imgIndex]} alt={`${project.name} — captura ${imgIndex + 1}`} />
          {images.length > 1 && (
            <button
              type="button"
              className={`${styles.modalNav} ${styles.modalNavPrev}`}
              onClick={(e) => {
                e.stopPropagation()
                setImgIndex((i) => (i - 1 + images.length) % images.length)
              }}
              aria-label="Captura anterior"
            >
              ‹
            </button>
          )}
          {images.length > 1 && (
            <button
              type="button"
              className={`${styles.modalNav} ${styles.modalNavNext}`}
              onClick={(e) => {
                e.stopPropagation()
                setImgIndex((i) => (i + 1) % images.length)
              }}
              aria-label="Captura siguiente"
            >
              ›
            </button>
          )}
          {images.length > 1 && (
            <span className={styles.modalCounter}>{imgIndex + 1} / {images.length}</span>
          )}
          <button
            type="button"
            className={styles.modalClose}
            onClick={(e) => {
              e.stopPropagation()
              setFullscreen(false)
            }}
            aria-label="Cerrar pantalla completa"
          >
            ×
          </button>
        </div>
      )}
    </div>,
    document.body
  )
}

function ProjectsSection({ projects: list }) {
  const [activeProject, setActiveProject] = useState(null)

  const featured = list.find((p) => p.name.includes('Documentación')) || list[0]
  const rest = list.filter((p) => p !== featured)

  return (
    <>
      <article className={styles.caseStudy}>
        <div className={styles.caseMeta}>
          <StatusPill status={featured.status} />
          <span className={styles.eyebrow}>caso destacado</span>
        </div>
        <h3 className={styles.caseTitle}>{featured.name}</h3>
        <div className={styles.caseBody}>
          <div>
            <span className={styles.caseColLabel}>El problema</span>
            <p>{featured.problem}</p>
          </div>
          <div>
            <span className={styles.caseColLabel}>La solución</span>
            <p>{featured.description}</p>
          </div>
        </div>
        {featured.approach && (
          <div className={styles.caseApproach}>
            <span className={styles.caseColLabel}>Cómo funciona</span>
            <ul>
              {featured.approach.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </div>
        )}
        {featured.images && featured.images.length > 0 && (
          <div className={styles.caseThumbs}>
            {featured.images.map((src, i) => (
              <button key={src} type="button" onClick={() => setActiveProject(featured)} aria-label={`Ver capturas de ${featured.name}`}>
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
        <div className={styles.tagRow}>
          {featured.tech.map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </article>

      <div className={styles.projectList}>
        {rest.map((p) => (
          <div key={p.name} className={styles.projectRow}>
            <div className={styles.projectHead}>
              <span className={styles.projectName}>{p.name}</span>
              <StatusPill status={p.status} />
            </div>
            <div>
              <p className={styles.projectDesc}>{p.description}</p>
              {p.images && p.images.length > 0 && (
                <div className={styles.thumbRow}>
                  {p.images.slice(0, 4).map((src) => (
                    <button key={src} type="button" onClick={() => setActiveProject(p)} aria-label={`Ver capturas de ${p.name}`}>
                      <img src={src} alt="" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
              <div className={styles.tagRow} style={{ marginBottom: '0.75rem' }}>
                {p.tech.map((t) => (
                  <span key={t} className={styles.tag}>{t}</span>
                ))}
              </div>
              <button type="button" className={styles.projectLink} onClick={() => setActiveProject(p)}>
                Ver detalle
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeProject && (
        <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
      )}
    </>
  )
}

const DAY_TAGS = ['Power BI', 'DAX', 'Power Query (M)', 'SQL', 'Modelado dimensional']
const NIGHT_TAGS = ['Next.js', 'React', 'PWA', 'Claude Code', 'LLMs']

function PerspectiveSection() {
  const [mode, setMode] = useState('day')

  return (
    <section className={styles.band + ' ' + styles.section} id="perfil">
      <div className={styles.container}>
        <Reveal>
          <div className={styles.toggleRow}>
            <div>
              <span className={styles.eyebrow}>enfoque</span>
              <h2 className={styles.perspectiveTitleSm}>Dos caras del mismo trabajo</h2>
            </div>
            <div className={styles.toggleGroup} role="tablist">
              <button
                className={`${styles.toggleBtn} ${mode === 'day' ? styles.toggleBtnActive : ''}`}
                onClick={() => setMode('day')}
              >
                ☀ De día · Consultor BI
              </button>
              <button
                className={`${styles.toggleBtn} ${mode === 'night' ? styles.toggleBtnActive : ''}`}
                onClick={() => setMode('night')}
              >
                ☾ De noche · Product Builder
              </button>
            </div>
          </div>

          <div className={`${styles.perspective} ${mode === 'day' ? styles.perspectiveActive : ''}`}>
            <h3 className={styles.perspectiveTitle}>De día: BI &amp; analítica estratégica</h3>
            <p className={styles.perspectiveText}>
              Diseño de modelos tabulares, DAX, optimización de queries y tableros de control orientados a negocio y operaciones. Interlocución directa con áreas de finanzas y dirección para traducir preguntas de negocio en datos.
            </p>
            <div className={styles.tagRow}>
              {DAY_TAGS.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          </div>
          <div className={`${styles.perspective} ${mode === 'night' ? styles.perspectiveActive : ''}`}>
            <h3 className={styles.perspectiveTitle}>De noche: software y automatización con IA</h3>
            <p className={styles.perspectiveText}>
              Construcción de herramientas propias para resolver problemas sin solución directa en el mercado: pipelines de datos, scraping, integración de LLMs y aplicaciones en producción de uso diario.
            </p>
            <div className={styles.tagRow}>
              {NIGHT_TAGS.map((t) => <span key={t} className={styles.tag}>{t}</span>)}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function AskWidget() {
  const [query, setQuery] = useState('')
  const [log, setLog] = useState([])

  function ask(question) {
    if (!question.trim()) return
    const answer = getAnswer(question)
    setLog((prev) => [...prev, { question, answer }])
    setQuery('')
  }

  return (
    <section className={`${styles.band} ${styles.section}`} id="pregunta">
      <div className={styles.container}>
        <Reveal>
          <SectionHeading
            kicker="Charla rápida"
            title="Pregúntame algo"
            intro="Preguntas rápidas sobre mi trayectoria, mi stack o mis proyectos — respondidas al momento, sin que tengas que leer toda la página."
          />

          <div className={styles.askChips}>
            {suggestions.map((s) => (
              <button key={s} className={styles.askChip} onClick={() => ask(s)}>
                {s}
              </button>
            ))}
          </div>

          <form
            className={styles.askForm}
            onSubmit={(e) => {
              e.preventDefault()
              ask(query)
            }}
          >
            <input
              className={styles.askInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe tu pregunta..."
              aria-label="Escribe tu pregunta"
            />
            <button type="submit" className={styles.askSubmit}>Preguntar</button>
          </form>

          {log.length > 0 && (
            <div className={styles.askLog}>
              {log.map((item, i) => (
                <div key={i} className={styles.askItem}>
                  <p className={styles.askQ}>{item.question}</p>
                  <p className={styles.askA}>{item.answer}</p>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function CvCapture({ visible, onDone }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!visible) return null

  return (
    <div className={styles.cvCapture}>
      {submitted ? (
        <p className={styles.cvCaptureThanks}>Hecho, te aviso cuando lo actualice. Gracias 🙌</p>
      ) : (
        <form
          className={styles.cvCaptureForm}
          onSubmit={(e) => {
            e.preventDefault()
            if (!email.trim()) return
            notifyCvEmailOptIn(email.trim())
            setSubmitted(true)
          }}
        >
          <p className={styles.cvCaptureHook}>
            ¿Quieres que te avise cuando actualice el CV? Deja tu email.
          </p>
          <div className={styles.cvCaptureRow}>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className={styles.askInput}
              aria-label="Tu email"
            />
            <button type="submit" className={styles.askSubmit}>Avísame</button>
            <button type="button" className={styles.cvCaptureDismiss} onClick={onDone}>
              No, gracias
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default function Home() {
  const [cvClicked, setCvClicked] = useState(false)
  function handleCvClick() {
    notifyCvDownload()
    setCvClicked(true)
  }

  const statLine = stats.map((s, i) => (
    <span key={s.key}>
      <span className={styles.statNum}>{s.value}</span> {s.label}
      {i < stats.length - 1 ? ' · ' : ''}
    </span>
  ))

  return (
    <>
      <Head>
        <title>{profile.name}</title>
        <meta
          name="description"
          content="Jorge Sanz — Data Analyst & BI Consultant. Dashboards en Power BI, automatización de informes y aplicaciones propias construidas con Next.js e IA."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="canonical" href="https://jorgesanz6.github.io/" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jorgesanz6.github.io/" />
        <meta property="og:title" content={profile.name} />
        <meta
          property="og:description"
          content="BI de día, producto por mi cuenta de noche: dashboards que optimizo un 60%, y dos apps propias que uso yo mismo cada día."
        />
        <meta property="og:image" content="https://jorgesanz6.github.io/og-image.png" />
        <meta property="og:locale" content="es_ES" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={profile.name} />
        <meta
          name="twitter:description"
          content="BI de día, producto por mi cuenta de noche: dashboards que optimizo un 60%, y dos apps propias que uso yo mismo cada día."
        />
        <meta name="twitter:image" content="https://jorgesanz6.github.io/og-image.png" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: profile.name,
              jobTitle: profile.role,
              description: 'Analista de Business Intelligence especializado en Power BI, automatización de procesos y desarrollo de aplicaciones web.',
              url: 'https://jorgesanz6.github.io/',
              image: 'https://jorgesanz6.github.io/avatar.jpg',
              email: `mailto:${profile.email}`,
              address: {
                '@type': 'PostalAddress',
                addressLocality: profile.location,
              },
              sameAs: [`https://github.com/${profile.github}`, linkedinUrl],
            }),
          }}
        />
      </Head>

      <div className={styles.page}>
        <nav className={styles.nav}>
          <div className={styles.navInner}>
            <span className={styles.navName}><span>~</span>/jorgesanz</span>
            <div className={styles.navLinks}>
              <div className={styles.navAnchors}>
                <a href="#proyectos">Proyectos</a>
                <a href="#experiencia">Experiencia</a>
                <a href="#credenciales">Certificaciones</a>
                <a href="#pregunta">Pregúntame</a>
                <a href="#contacto">Contacto</a>
              </div>
              <a href={cvUrl} download={cvFilename} data-goatcounter-click="cv-download" onClick={handleCvClick} className={styles.navCv}>
                CV
              </a>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <main className={styles.main}>

          {/* HERO */}
          <section className={styles.band + ' ' + styles.hero}>
            <div className={styles.container}>
              <div className={styles.heroHead}>
                <div>
                  <div className={styles.avatarRow}>
                    <img className={styles.avatar} src="/avatar.jpg" alt={profile.name} />
                    <span className={styles.eyebrow}>perfil</span>
                  </div>
                  <h1 className={styles.heroName}>{profile.name}</h1>
                  <p className={styles.heroRole}>{profile.role} — {profile.location}</p>
                </div>
                <div className={styles.terminal}>
                  <div className={styles.terminalBar}>
                    <span className={styles.terminalDot} style={{ background: '#f87171' }} />
                    <span className={styles.terminalDot} style={{ background: '#fbbf24' }} />
                    <span className={styles.terminalDot} style={{ background: '#4ade80' }} />
                    <span className={styles.windowLabel}>jorge@bi ~ perfil.sql</span>
                  </div>
                  <div className={styles.windowPad}>
                    <p className={styles.promptLine}>
                      <span className={styles.sign}>jorge@bi=#</span>
                      <span className={styles.terminalKw}>SELECT </span>nombre, rol, ubicacion
                    </p>
                    <p className={styles.promptLine}><span className={styles.terminalKw}>FROM </span>jorge</p>
                    <p className={styles.promptLine}><span className={styles.terminalKw}>WHERE </span>foco = <span className={styles.terminalStr}>&apos;impacto de negocio&apos;</span>;</p>
                    <p className={styles.terminalOut}>→ 1 fila · {profile.name}, {profile.role}, {profile.location}</p>
                  </div>
                </div>
              </div>

              <p className={styles.heroPos}>
                &quot;Reduzco la distancia entre una pregunta de negocio y la respuesta en un dashboard — y cuando la herramienta que necesito no existe, la construyo yo mismo.&quot;
              </p>
              <p className={styles.heroBio}>{profile.bio}</p>

              <div className={styles.quickFacts}>
                <span className={`${styles.factChip} ${styles.factChipStrong}`}>{stats[1].value} años en datos</span>
                <span className={`${styles.factChip} ${styles.factChipStrong}`}>{stats[2].value} años en BI</span>
                <span className={styles.factChip}>Power BI · DAX · SQL</span>
                <span className={styles.factChip}>{languages[0]} · {languages[1]}</span>
                <span className={styles.factChip}>{profile.location}</span>
              </div>

              <div className={styles.heroActions}>
                <a href="#contacto" className={styles.btnPrimary}>Contactar</a>
                <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.contactLinkItem}>
                  LinkedIn
                </a>
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.contactLinkItem}
                >
                  GitHub
                </a>
                <a
                  href={cvUrl}
                  download={cvFilename}
                  data-goatcounter-click="cv-download"
                  onClick={handleCvClick}
                  className={styles.contactLinkItem}
                >
                  Descargar CV
                </a>
              </div>
              <CvCapture visible={cvClicked} onDone={() => setCvClicked(false)} />
            </div>
          </section>

          {/* PROYECTOS */}
          <section className={styles.band + ' ' + styles.section} id="proyectos">
            <div className={styles.container}>
              <Reveal>
                <SectionHeading
                  kicker="Lo que he construido"
                  title="Proyectos"
                  intro="Software propio, en producción o uso diario real — con capturas reales, no maquetas."
                />
                <div style={{ marginTop: '2.5rem' }}>
                  <ProjectsSection projects={projects} />
                </div>
              </Reveal>
            </div>
          </section>

          {/* ACTIVIDAD GITHUB */}
          <section className={styles.band + ' ' + styles.tint + ' ' + styles.section} id="actividad">
            <div className={styles.container}>
              <Reveal>
                <SectionHeading kicker="En vivo desde GitHub" title="Actividad" />
                <div style={{ marginTop: '2rem' }}>
                  <GithubActivity />
                </div>
              </Reveal>
            </div>
          </section>

          {/* ENFOQUE */}
          <PerspectiveSection />

          {/* CÓMO TRABAJO */}
          <section className={styles.band + ' ' + styles.section}>
            <div className={styles.container}>
              <Reveal>
                <SectionHeading kicker="Metodología" title="Cómo trabajo" />
                <p className={styles.methodIntro} style={{ marginTop: '1.5rem' }}>{methodologyIntro}</p>
                <ol className={styles.methodList}>
                  {methodology.map((step, i) => (
                    <li key={step.title} className={styles.methodItem}>
                      <span className={styles.methodNumber}>{METHOD_ICONS[i]}</span>
                      <p className={styles.methodTitle}>{step.title}</p>
                      <p className={styles.methodDesc}>{step.description}</p>
                    </li>
                  ))}
                </ol>
                <span className={`${styles.eyebrow} ${styles.subKicker}`}>Con qué trabajo</span>
                <div className={styles.skillsGrid}>
                  {skills.map((group) => (
                    <div key={group.group} className={styles.skillGroup}>
                      <p className={styles.skillGroupName}>{group.group}</p>
                      <div className={styles.skillTags}>
                        {group.items.map((item) => (
                          <span key={item} className={styles.tag}>{item}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* EXPERIENCIA */}
          <section className={styles.band + ' ' + styles.tint + ' ' + styles.section} id="experiencia">
            <div className={styles.container}>
              <Reveal>
                <SectionHeading kicker="Cómo he llegado hasta aquí" title="Experiencia" />
                <p className={styles.statLine} style={{ marginTop: '2rem' }}>{statLine}</p>
                <div className={styles.expList}>
                  {experience.map((e, i) => (
                    <div key={i} className={styles.expItem}>
                      <div>
                        <span className={styles.expPeriod}>{e.period}</span>
                      </div>
                      <div>
                        <p className={styles.expRole}>{e.role}</p>
                        <p className={styles.expCompany}>{e.company}</p>
                        <p className={styles.expDesc}>{e.description}</p>
                        {e.impact && <p className={styles.expImpact}>Impacto: {e.impact}</p>}
                        {(e.problem || e.approach) && (
                          <details className={styles.projectDetails}>
                            <summary>Ver caso completo</summary>
                            {e.problem && (
                              <div className={styles.projectDetailBlock}>
                                <span className={styles.projectDetailLabel}>Problema</span>
                                <p>{e.problem}</p>
                              </div>
                            )}
                            {e.approach && (
                              <div className={styles.projectDetailBlock}>
                                <span className={styles.projectDetailLabel}>Qué hice</span>
                                {Array.isArray(e.approach) ? (
                                  <ul className={styles.detailList}>
                                    {e.approach.map((line) => (
                                      <li key={line}>{line}</li>
                                    ))}
                                  </ul>
                                ) : (
                                  <p>{e.approach}</p>
                                )}
                              </div>
                            )}
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </section>

          {/* CERTIFICACIONES Y EDUCACIÓN */}
          <section className={styles.band + ' ' + styles.section} id="credenciales">
            <div className={styles.container}>
              <Reveal>
                <SectionHeading kicker="Credenciales" title="Certificaciones y educación" />
                <div className={styles.credsGrid} style={{ marginTop: '2.5rem' }}>
                  <div>
                    <span className={styles.credsColLabel}>Certificaciones (últimos 6 meses)</span>
                    <ul className={styles.certList}>
                      {certifications.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className={styles.credsColLabel}>Educación</span>
                    {education.map((e) => (
                      <div key={e.degree} className={styles.eduItem}>
                        <div className={styles.eduDegree}>{e.degree}</div>
                        <div className={styles.eduSchool}>{e.school} · {e.year}</div>
                      </div>
                    ))}
                    <div className={styles.langRow}>
                      {languages.map((l) => (
                        <span key={l} className={styles.factChip}>{l}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          <AskWidget />

          {/* CONTACTO */}
          <section className={`${styles.band} ${styles.contactSection}`} id="contacto">
            <div className={styles.container}>
              <Reveal>
                <h2 className={styles.contactTitle}>¿Hablamos?</h2>
                <p className={styles.contactSub}>
                  Abierto a colaboraciones, proyectos de datos o simplemente intercambiar ideas.
                </p>
                <a href={`mailto:${profile.email}`} className={styles.contactEmail}>
                  {profile.email}
                </a>
                <div className={styles.contactLinks}>
                  <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className={styles.contactLinkItem}>
                    LinkedIn
                  </a>
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.contactLinkItem}
                  >
                    GitHub
                  </a>
                </div>
              </Reveal>
            </div>
          </section>

        </main>

        <footer className={styles.footer}>
          <span>{profile.name} · {new Date().getFullYear()}</span>
          <span>{profile.location}</span>
        </footer>
      </div>
    </>
  )
}
