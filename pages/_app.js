import "../styles/globals.css"
import { Spectral } from "@next/font/google"

// importing the Spectral font with
// the Next.js 13 Font Optimization Feature
const spectral = Spectral({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

function MyApp({ Component, pageProps }) {
  return <main className={spectral.className}>
    <Component {...pageProps} />
  </main>
}

export default MyApp
