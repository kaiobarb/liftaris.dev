import styles from '../styles/Footer.module.css'

export default function Footer() {
  return (
    <>
      <div className={styles.waveContainer}>
        <div className={styles.wave} />
      </div>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Kaio
          <br />
          Credit to <a href="https://openprocessing.org/user/208584?view=sketches&o=2">Juakin Halkomäki</a> for the squishy blob</p>
      </footer>
    </>
  )
}
