'use client'

import { useTina } from 'tinacms/dist/react'
import { TinaMarkdown, TinaMarkdownContent } from "tinacms/dist/rich-text"
import type { AboutQuery, AboutQueryVariables } from "../../tina/__generated__/types"
import styles from '../../styles/About.module.css'

interface AboutClientProps {
  data: AboutQuery
  query: string
  variables: AboutQueryVariables
}

function reformatDate(fullDate: string | null | undefined): string {
  if (!fullDate) return "Present"
  const date = new Date(fullDate)
  return `${date.getMonth() + 1}/${date.getFullYear()}`
}

export default function AboutClient(props: AboutClientProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })

  return (
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
            <h3>
              {exp.showStartDate && reformatDate(exp.dateStart)}
              {exp.showEndDate && ` - ${reformatDate(exp.dateEnd)}`}
            </h3>
            <p style={{ whiteSpace: 'pre-line' }}>{exp?.description}</p>
          </li>
        ))}
        <li className={styles.about__listEnd} />
      </ul>
    </article>
  )
}
