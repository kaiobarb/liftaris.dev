import "../styles/globals.css"
import { Work_Sans } from "@next/font/google"

// importing the Work Sans font with
// the Next.js 13 Font Optimization Feature
const workSans = Work_Sans({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
})

function MyApp({ Component, pageProps }) {
  return <main className={workSans.className}>
    <Component {...pageProps} />
  </main>
}

export default MyApp
