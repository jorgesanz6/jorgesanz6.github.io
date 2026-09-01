import Head from 'next/head'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { profile, skills, projects, experience, cvUrl, cvFilename, stats, methodology, methodologyIntro, linkedinUrl } from '../lib/data'
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

const QUERY_SEGMENTS = [
  { text: 'SELECT ', kw: true },
  { text: 'impacto ' },
  { text: 'FROM ', kw: true },
  { text: 'jorge ' },
  { text: 'WHERE ', kw: true },
  { text: 'año >= ' },
  { text: '2022', str: true },
  { text: ';' },
]
const QUERY_TEXT = QUERY_SEGMENTS.map((s) => s.text).join('')

function TerminalStats({ stats }) {
  const ref = useRef(null)
  const [active, setActive] = useState(false)
  const [typed, setTyped] = useState(0)
  const [rowsShown, setRowsShown] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || typeof IntersectionObserver === 'undefined') {
      setTyped(QUERY_TEXT.length)
      setRowsShown(stats.length)
      return
    }

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setActive(true)
      return
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          io.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    io.observe(el)

    const fallback = setTimeout(() => setActive(true), 2500)

    return () => {
      io.disconnect()
      clearTimeout(fallback)
    }
  }, [stats.length])

  useEffect(() => {
    if (!active || typed >= QUERY_TEXT.length) return
    const t = setTimeout(() => setTyped((n) => n + 1), 55)
    return () => clearTimeout(t)
  }, [active, typed])

  useEffect(() => {
    if (typed < QUERY_TEXT.length || rowsShown >= stats.length) return
    const t = setTimeout(() => setRowsShown((n) => n + 1), 280)
    return () => clearTimeout(t)
  }, [typed, rowsShown, stats.length])

  let remaining = typed
  const segments = QUERY_SEGMENTS.map((seg, i) => {
    const take = Math.max(0, Math.min(seg.text.length, remaining))
    remaining -= seg.text.length
    if (take === 0) return null
    const cls = seg.kw ? styles.terminalKw : seg.str ? styles.terminalStr : undefined
    return (
      <span key={i} className={cls}>
        {seg.text.slice(0, take)}
      </span>
    )
  })

  const queryDone = typed >= QUERY_TEXT.length

  return (
    <div className={styles.terminal} ref={ref}>
      <div className={styles.terminalBar}>
        <span className={styles.terminalDot} style={{ background: '#f87171' }} />
        <span className={styles.terminalDot} style={{ background: '#fbbf24' }} />
        <span className={styles.terminalDot} style={{ background: '#4ade80' }} />
      </div>
      <div className={styles.terminalBody}>
        <div className={styles.terminalQuery}>
          {segments}
          {!queryDone && <span className={styles.terminalCursor} />}
        </div>
        {stats.map((s, i) => (
          <div
            key={s.key}
            className={`${styles.terminalRow} ${i < rowsShown ? styles.terminalRowVisible : styles.terminalRowHidden}`}
          >
            <span className={styles.terminalField}>{s.key}</span>
            <span className={styles.terminalValue}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
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

function SectionHeading({ kicker, title }) {
  return (
    <h2 className={styles.sectionTitle}>
      <span className={styles.sectionKicker}>{kicker}</span>
      {title}
    </h2>
  )
}

function ProjectDetailBody({ project }) {
  return (
    <>
      <p className={styles.projectDesc}>{project.description}</p>
      <div className={styles.projectTech}>
        {project.tech.map((t) => (
          <span key={t} className={styles.techTag}>{t}</span>
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
          <span className={styles.projectStatus}>{project.status}</span>
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
  const [activeIndex, setActiveIndex] = useState(null)

  return (
    <>
      <div className={styles.projectList}>
        {list.map((p, i) => (
          <div key={i} className={styles.project}>
            <div className={styles.projectBody}>
              <div className={styles.projectHeader}>
                <span className={styles.projectName}>{p.name}</span>
                <span className={styles.projectStatus}>{p.status}</span>
              </div>
              <p className={styles.projectDesc}>{p.description}</p>
              <div className={styles.projectTech}>
                {p.tech.map((t) => (
                  <span key={t} className={styles.techTag}>{t}</span>
                ))}
              </div>
              {p.images && (
                <button
                  type="button"
                  className={styles.projectCover}
                  onClick={() => setActiveIndex(i)}
                  aria-label={`Ver capturas de ${p.name}`}
                >
                  <img src={p.images[0]} alt={`${p.name} — vista previa`} loading="lazy" />
                  {p.images.length > 1 && (
                    <span className={styles.projectCoverCount}>+{p.images.length - 1} más</span>
                  )}
                </button>
              )}
              <button type="button" className={styles.projectLink} onClick={() => setActiveIndex(i)}>
                Ver detalle
              </button>
            </div>
          </div>
        ))}
      </div>

      {activeIndex !== null && (
        <ProjectModal project={list[activeIndex]} onClose={() => setActiveIndex(null)} />
      )}
    </>
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
          <SectionHeading kicker="Charla rápida" title="Pregúntame algo" />
          <p className={styles.askHint}>
            Preguntas rápidas sobre mi trayectoria, mi stack o mis proyectos — respondidas al momento, sin que tengas que leer toda la página.
          </p>

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
            <span className={styles.navName}>JS</span>
            <div className={styles.navLinks}>
              <a href="#proyectos">Proyectos</a>
              <a href="#experiencia">Experiencia</a>
              <a href="#pregunta">Pregúntame</a>
              <a href="#contacto">Contacto</a>
              <ThemeToggle />
            </div>
          </div>
        </nav>

        <main className={styles.main}>

          {/* HERO */}
          <section className={styles.band + ' ' + styles.hero}>
            <div className={styles.heroGrid} aria-hidden="true" />
            <div className={styles.container}>
              <div className={styles.heroContent}>
                <div className={styles.terminal}>
                  <div className={styles.terminalBar}>
                    <span className={styles.terminalDot} style={{ background: '#f87171' }} />
                    <span className={styles.terminalDot} style={{ background: '#fbbf24' }} />
                    <span className={styles.terminalDot} style={{ background: '#4ade80' }} />
                    <span className={styles.windowLabel}>jorgesanz6.github.io</span>
                  </div>
                  <div className={styles.windowPad}>
                    <p className={styles.promptLine}>
                      <span className={styles.sign}>jorge@bi=#</span>
                      <span className={styles.terminalKw}>SELECT </span>nombre <span className={styles.terminalKw}>FROM </span>jorge;
                    </p>
                    <h1 className={styles.heroName}>{profile.name}</h1>
                    <p className={styles.heroRole}>{profile.role}</p>
                    <p className={styles.heroPos}>
                      Reduzco la distancia entre una pregunta de negocio y la respuesta en un dashboard — y cuando la herramienta que necesito no existe, la construyo yo mismo.
                    </p>
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
                </div>
              </div>
            </div>
          </section>

          {/* PROYECTOS */}
          <section className={styles.band + ' ' + styles.section} id="proyectos">
            <div className={styles.container}>
              <Reveal>
                <SectionHeading kicker="Lo que he construido" title="Proyectos" />
                <div className={styles.terminal}>
                  <div className={styles.terminalBar}>
                    <span className={styles.terminalDot} style={{ background: '#f87171' }} />
                    <span className={styles.terminalDot} style={{ background: '#fbbf24' }} />
                    <span className={styles.terminalDot} style={{ background: '#4ade80' }} />
                  </div>
                  <div className={styles.windowPad}>
                    <p className={styles.promptLine}>
                      <span className={styles.sign}>jorge@bi=#</span>
                      <span className={styles.terminalKw}>SELECT * FROM </span>proyectos;
                    </p>
                    <ProjectsSection projects={projects} />
                  </div>
                </div>
              </Reveal>
            </div>
          </section>

          {/* EXPERIENCIA */}
          <section className={styles.band + ' ' + styles.tint + ' ' + styles.section} id="experiencia">
            <div className={styles.container}>
              <Reveal>
                <SectionHeading kicker="Cómo he llegado hasta aquí" title="Experiencia" />
                <TerminalStats stats={stats} />
                <p className={styles.statsCaption}>
                  {stats.map((s) => s.label).join(' · ')}
                </p>
                <div className={styles.ghSpacer}>
                  <GithubActivity />
                </div>
                <div className={styles.expList}>
                  {experience.map((e, i) => (
                    <div key={i} className={styles.expItem}>
                      <div className={styles.expMeta}>
                        <span className={styles.expPeriod}>{e.period}</span>
                      </div>
                      <div className={styles.expContent}>
                        <p className={styles.expRole}>{e.role}</p>
                        <p className={styles.expCompany}>{e.company}</p>
                        <p className={styles.expDesc}>{e.description}</p>
                        {(e.problem || e.approach || e.impact) && (
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
                            {e.impact && (
                              <div className={styles.projectDetailBlock}>
                                <span className={styles.projectDetailLabel}>Impacto</span>
                                <p>{e.impact}</p>
                              </div>
                            )}
                          </details>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <a
                  href={cvUrl}
                  download={cvFilename}
                  data-goatcounter-click="cv-download"
                  onClick={handleCvClick}
                  className={styles.projectLink}
                >
                  Ver historial completo en el CV
                </a>
              </Reveal>
            </div>
          </section>

          {/* CÓMO TRABAJO */}
          <section className={styles.band + ' ' + styles.section}>
            <div className={styles.container}>
              <Reveal>
                <SectionHeading kicker="Metodología" title="Cómo trabajo" />
                <p className={styles.methodIntro}>{methodologyIntro}</p>
                <div className={styles.methodList}>
                  {methodology.map((step, i) => (
                    <div key={step.title} className={styles.methodItem}>
                      <span className={styles.methodNumber}>{METHOD_ICONS[i]}</span>
                      <div>
                        <p className={styles.methodTitle}>{step.title}</p>
                        <p className={styles.methodDesc}>{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className={`${styles.sectionKicker} ${styles.subKicker}`}>Con qué trabajo</p>
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
