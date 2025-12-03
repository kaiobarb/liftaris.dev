import "../styles/globals.css"
import { Spectral } from "next/font/google"
import type { AppProps } from 'next/app'

const spectral = Spectral({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <main className={spectral.className}>
      <Component {...pageProps} />
    </main>
  )
}
