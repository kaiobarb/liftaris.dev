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
    <Header siteTitle={props.siteTitle} />
    <div className={styles.content}>{props.children}</div>
  </section>
  )
}