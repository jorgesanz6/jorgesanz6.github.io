import Head from 'next/head'
import { profile } from '../lib/data'
import styles from '../styles/NotFound.module.css'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Página no encontrada · {profile.name}</title>
        <meta name="robots" content="noindex" />
        <link rel="icon" href="/favicon.png" type="image/png" />
      </Head>

      <div className={styles.page}>
        <div className={styles.grid} aria-hidden="true" />
        <div className={styles.content}>
          <p className={styles.code}>404</p>
          <p className={styles.title}>Esta página no existe</p>
          <p className={styles.desc}>
            El enlace está roto o la página se movió. Vuelve al inicio y sigue desde ahí.
          </p>
          <a href="/" className={styles.btn}>Volver al inicio</a>
        </div>
      </div>
    </>
  )
}
