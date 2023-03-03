import Header from "./Header"
import Meta from './Meta'
import styles from '../styles/Layout.module.css'

export default function Layout(props) {
  return (
    <section
      className={styles.layout}
    >
      <Meta
        siteTitle={props.siteTitle}
        siteDescription={props.siteDescription}
      />

      <div className={styles.content}>
        <Header siteTitle={props.siteTitle} />
        {props.children}
      </div>
      <div className={styles.waveContainer}>
        <div className={styles.wave} />
      </div>
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Kaio
          <br />
          Credit to <a href="https://openprocessing.org/user/208584?view=sketches&o=2">Juakin Halkomäki</a> for the squishy blob</p>
      </footer>
    </section >
  )
}