'use client'

import Image from "next/image"
import { useTina } from 'tinacms/dist/react'
import { TinaMarkdown, TinaMarkdownContent, Components } from "tinacms/dist/rich-text"
import type { PostQuery, PostQueryVariables } from "../../tina/__generated__/types"
import ThemeImage from "../ThemeImage"
import styles from '../../styles/Blog.module.css'

interface PostClientProps {
  data: PostQuery
  query: string
  variables: PostQueryVariables
}

const components: Components<{
  ThemeImage: { lightSrc: string; darkSrc: string; alt: string }
}> = {
  ThemeImage: (props) => (
    <ThemeImage lightSrc={props.lightSrc} darkSrc={props.darkSrc} alt={props.alt} />
  ),
}

function reformatDate(fullDate: string): string {
  const date = new Date(fullDate)
  return date.toDateString().slice(4)
}

export default function PostClient(props: PostClientProps) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })

  return (
    <article className={styles.blog}>
      <figure className={styles.blog__hero}>
        <Image
          width={800}
          height={450}
          src={data.post?.hero_image || ""}
          alt={data.post?.title || "No Title"}
          style={{ width: "100%", height: "auto" }}
        />
      </figure>
      <div className={styles.blog__info}>
        <h1>{data.post?.title || "Article Title Not found"}</h1>
        <h3>{reformatDate(data.post?.date || "NO DATE")}</h3>
      </div>
      <div className={styles.blog__body}>
        <TinaMarkdown content={data.post?.body as TinaMarkdownContent} components={components} />
      </div>
    </article>
  )
}
