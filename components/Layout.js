import Header from './Header'
import Meta from './Meta'
import Footer from './Footer'
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
      <Footer />
    </section >
  )
}