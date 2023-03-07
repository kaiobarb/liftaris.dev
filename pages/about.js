

import Image from "next/image"
import styles from "../styles/About.module.css"
// import glob from "glob"
import Layout from "../components/Layout"
import { useTina } from 'tinacms/dist/react'
import client from "../.tina/__generated__/client"
import { useEffect } from "react"
import { TinaMarkdown } from "tinacms/dist/rich-text";

function reformatDate(fullDate) {
  if (!fullDate) return "Present"
  const date = new Date(fullDate)
  return `${date.getMonth() + 1}/${date.getFullYear()}`
}

export default function About(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })

  return (
    <Layout siteTitle={props.siteTitle}>
      <article className={styles.about}>
        <img src={data.about.profile} alt="profile" className={styles.about__profile} />
        <div className={styles.about__body}>
          <TinaMarkdown content={data.about.body} />
        </div>
        <ul>
          {data.about ? data.about.experience?.map((exp, i) => (
            <li key={i} className={exp.hasPassed ? styles.hasPassed : ''}>
              <h2>{exp.title}</h2>
                <h3> {exp.showStartDate && reformatDate(exp.dateStart)}{exp.showEndDate && ` - ${reformatDate(exp.dateEnd)}`}</h3>
              <TinaMarkdown content={exp.description} />
            </li>
          ))
            : null}
          <li className={styles.about__listEnd} />
        </ul>
        <div>
          <TinaMarkdown content={data.post ? data.post.body : ""} />
        </div>
      </article>
    </Layout >
  )
}

export async function getStaticProps(context) {
  // extracting the slug from the context
  // const { slug } = context.params
  const config = await import(`../data/config.json`)

  let data = {}
  let query = {}
  let variables = { relativePath: 'about.md' }
  try {
    const res = await client.queries.about(variables)
    query = res.query
    data = res.data
    variables = res.variables
  } catch {
    // swallow errors related to document creation
  }

  return {
    props: {
      data,
      query,
      variables,
      siteTitle: config.title,
    },
  }
}