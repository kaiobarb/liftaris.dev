import styles from "../styles/About.module.css"
import Layout from "../components/Layout"
import { useTina } from 'tinacms/dist/react'
import client from "../tina/__generated__/client"
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text"
import type { GetStaticProps } from 'next'
import type { AboutQuery, AboutQueryVariables } from "../tina/__generated__/types"

function reformatDate(fullDate: string | null | undefined): string {
  if (!fullDate) return "Present"
  const date = new Date(fullDate)
  return `${date.getMonth() + 1}/${date.getFullYear()}`
}

interface AboutProps {
  data: AboutQuery
  query: string
  variables: AboutQueryVariables
  siteTitle: string
}

export default function About(props: AboutProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })

  return (
    <Layout siteTitle={props.siteTitle}>
      <article className={styles.about}>
        {data?.about?.profile && (
          <img src={data.about.profile} alt="profile" className={styles.about__profile} />
        )}
        <div className={styles.about__body}>
          <TinaMarkdown content={data?.about?.body as TinaMarkdownContent} />
        </div>
        <ul>
          {data?.about?.experience?.map((exp, i) => (
            <li key={i} className={exp.hasPassed ? styles.hasPassed : ''}>
              <h2>{exp.title}</h2>
                <h3> {exp.showStartDate && reformatDate(exp.dateStart)}{exp.showEndDate && ` - ${reformatDate(exp.dateEnd)}`}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{exp?.description}</p>
            </li>
          ))}
          <li className={styles.about__listEnd} />
        </ul>
      </article>
    </Layout >
  )
}

export const getStaticProps: GetStaticProps<AboutProps> = async () => {
  const config = await import('../data/config.json')

  const variables: AboutQueryVariables = { relativePath: 'about.md' }
  let data: AboutQuery = {} as AboutQuery
  let query = ''

  try {
    const res = await client.queries.about(variables)
    query = res.query
    data = res.data
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
