import Head from 'next/head'
import { useEffect, useState } from 'react'
import { profile, skills, projects, experience } from '../lib/data'
import styles from '../styles/Home.module.css'

function ThemeToggle() {
  const [theme, setTheme] = useState(null)

  useEffect(() => {
    const stored = document.documentElement.getAttribute('data-theme')
    if (stored) {
      setTheme(stored)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('theme', next)
  }

  if (!theme) return <button className={styles.themeToggle} aria-hidden="true" />

  return (
    <button
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'}
      title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
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

export default function Home() {
  return (
    <>
      <Head>
        <title>{profile.name}</title>
        <meta name="description" content={profile.bio} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jorgesanz6.github.io/" />
        <meta property="og:title" content={profile.name} />
        <meta property="og:description" content={profile.bio} />
        <meta property="og:image" content="https://jorgesanz6.github.io/og-image.png" />
        <meta property="og:locale" content="es_ES" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={profile.name} />
        <meta name="twitter:description" content={profile.bio} />
        <meta name="twitter:image" content="https://jorgesanz6.github.io/og-image.png" />
      </Head>

      <div className={styles.page}>
        <nav className={styles.nav}>
          <span className={styles.navName}>JS</span>
          <div className={styles.navLinks}>
            <a href="#proyectos">Proyectos</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#contacto">Contacto</a>
            <ThemeToggle />
          </div>
        </nav>

        <main className={styles.main}>

          {/* HERO */}
          <section className={styles.hero}>
            <div className={styles.avatar}>JS</div>
            {profile.available && (
              <div className={styles.heroStatus}>
                <span className={styles.dot} />
                Disponible para proyectos
              </div>
            )}
            <h1 className={styles.heroName}>{profile.name}</h1>
            <p className={styles.heroRole}>{profile.role}</p>
            <p className={styles.heroBio}>{profile.bio}</p>
            <div className={styles.heroActions}>
              <a href="#contacto" className={styles.btnPrimary}>Contactar</a>
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.btnSecondary}
              >
                GitHub
              </a>
            </div>
          </section>

          {/* SKILLS */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tecnologías</h2>
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
          </section>

          {/* PROYECTOS */}
          <section className={styles.section} id="proyectos">
            <h2 className={styles.sectionTitle}>Proyectos</h2>
            <div className={styles.projectList}>
              {projects.map((p, i) => (
                <div key={i} className={styles.project}>
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
                  {p.url && (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className={styles.projectLink}>
                      Ver proyecto →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* EXPERIENCIA */}
          <section className={styles.section} id="experiencia">
            <h2 className={styles.sectionTitle}>Experiencia</h2>
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
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CONTACTO */}
          <section className={styles.contactSection} id="contacto">
            <h2 className={styles.contactTitle}>¿Hablamos?</h2>
            <p className={styles.contactSub}>
              Abierto a colaboraciones, proyectos de datos o simplemente intercambiar ideas.
            </p>
            <a href={`mailto:${profile.email}`} className={styles.contactEmail}>
              {profile.email}
            </a>
            <div className={styles.contactLinks}>
              <a
                href={`https://github.com/${profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactLinkItem}
              >
                GitHub
              </a>
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
