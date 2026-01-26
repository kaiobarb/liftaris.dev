import client from "../../tina/__generated__/client"
import type { AboutQuery, AboutQueryVariables } from "../../tina/__generated__/types"
import AboutClient from "../../components/tina/AboutClient"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import styles from "../../styles/Layout.module.css"
import type { Metadata } from 'next'

async function getSiteConfig() {
  const config = await import('../../data/config.json')
  return { title: config.title }
}

async function getAboutData() {
  const variables: AboutQueryVariables = { relativePath: 'about.md' }

  try {
    const res = await client.queries.about(variables)
    return {
      data: res.data,
      query: res.query,
      variables,
    }
  } catch {
    return {
      data: {} as AboutQuery,
      query: '',
      variables,
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()
  return {
    title: `About | ${config.title}`,
  }
}

export default async function AboutPage() {
  const [aboutData, config] = await Promise.all([
    getAboutData(),
    getSiteConfig(),
  ])

  return (
    <section className={styles.layout}>
      <div className={styles.content}>
        <Header siteTitle={config.title} />
        <AboutClient {...aboutData} />
      </div>
      <Footer />
    </section>
  )
}
