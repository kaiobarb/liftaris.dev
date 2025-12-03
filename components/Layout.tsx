import { ReactNode } from 'react'
import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
import styles from '../styles/Layout.module.css'

interface LayoutProps {
  siteTitle?: string
  siteDescription?: string
  pathname?: string
  children: ReactNode
}

export default function Layout({ siteTitle, siteDescription, children }: LayoutProps) {
  return (
    <section className={styles.layout}>
      <Meta
        siteTitle={siteTitle}
        siteDescription={siteDescription}
      />

      <div className={styles.content}>
        <Header siteTitle={siteTitle} />
        {children}
      </div>
      <Footer />
    </section>
  )
}
