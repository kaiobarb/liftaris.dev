import Link from "next/link"
import { useState } from "react"
import styles from '../styles/Header.module.css'

export default function Header(props) {
  var darkMode = useState(false)
  return (
    <header className={styles.header}>
      <nav
        className={styles.nav}
        role="navigation"
        aria-label="main navigation"
      >
        <Link href="/" passHref>
          <h1>{props.siteTitle}</h1>
        </Link>
        <Link href="/" passHref>
          <h2>About</h2>
        </Link>
        <Link href="/" passHref>
          <h2>Work</h2>
        </Link>
        <button onClick={() => darkMode[1](!darkMode[0])}>
          toggle dark mode
        </button>
      </nav>
    </header>
  )
}

