import Head from 'next/head'
import { profile, skills, projects, experience } from '../lib/data'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>{profile.name}</title>
        <meta name="description" content={profile.bio} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.page}>
        <nav className={styles.nav}>
          <span className={styles.navName}>JS</span>
          <div className={styles.navLinks}>
            <a href="#proyectos">Proyectos</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#contacto">Contacto</a>
          </div>
        </nav>

        <main className={styles.main}>

          {/* HERO */}
          <section className={styles.hero}>
            <div className={styles.heroStatus}>
              <span className={styles.dot} />
              Disponible para proyectos
            </div>
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
