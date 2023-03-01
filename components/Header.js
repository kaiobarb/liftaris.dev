import Link from "next/link"
import { useEffect, useState } from "react"
import styles from '../styles/Header.module.css'

export default function Header(props) {
  var darkMode = useState(false)

  // Define behavior for when the page first loads
  useEffect(() => {
    if (localStorage.getItem("darkMode") === null) {
      console.log("dark mode preference not found in local storage");
      // if not set, set dark mode to true if the user's OS is set to dark mode
      let OSLikesDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      darkMode[1](OSLikesDark);
      localStorage.setItem("darkMode", OSLikesDark);
      if (OSLikesDark) {
        document.body.classList.add("dark")
      } else {
        document.body.classList.remove("dark")
      }
    } else if (localStorage.getItem("darkMode") === "true") {
      document.body.classList.add("dark")
    }
  }, [])

  useEffect(() => {
    if (darkMode[0]) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [darkMode[0]])

  const toggleDarkMode = (e) => {
    const toggle = !darkMode[0];
    darkMode[1](toggle);
    // store dark mode preference in local storage
    localStorage.setItem("darkMode", toggle);
  }


  return (
    <header className={styles.header}>
      <nav
        className={styles.nav}
        role="navigation"
        aria-label="main navigation"
      >
        <Link href="/" passHref>
          <h1>{props.siteTitle}</h1>
          <h5 style={{ color: "#555", fontWeight: 20, textAlign: "center" }}>Barbosa-Chifan</h5>
        </Link>
        <Link href="/" passHref>
          <h2>About</h2>
        </Link>
        <Link href="/" passHref>
          <h2>Work</h2>
        </Link>
        <div style={{width:"100px"}} className={`dark-is-${darkMode[0] ? "on" : "off"}`} onClick={toggleDarkMode}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path d="M448 256c0-106-86-192-192-192V448c106 0 192-86 192-192zm64 0c0 141.4-114.6 256-256 256S0 397.4 0 256S114.6 0 256 0S512 114.6 512 256z" />
          </svg>
        </div>
        {/* <button onClick={() => darkMode[1](!darkMode[0])}>
          toggle dark mode
        </button> */}
      </nav>
    </header>
  )
}

