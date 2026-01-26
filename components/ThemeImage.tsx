'use client'

import { useEffect, useState } from "react"
import Image from "next/image"

interface ThemeImageProps {
  lightSrc: string
  darkSrc: string
  alt: string
}

export default function ThemeImage({ lightSrc, darkSrc, alt }: ThemeImageProps) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check initial state
    setIsDark(document.body.classList.contains("dark"))

    // Listen for class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          setIsDark(document.body.classList.contains("dark"))
        }
      })
    })

    observer.observe(document.body, { attributes: true })

    return () => observer.disconnect()
  }, [])

  const src = isDark ? darkSrc : lightSrc

  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={450}
      style={{ width: "100%", height: "auto" }}
    />
  )
}
