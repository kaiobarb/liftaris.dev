

import Image from "next/image"
import styles from "../../styles/Blog.module.css"
import glob from "glob"
import Layout from "../../components/Layout"
import { useTina } from 'tinacms/dist/react'
import client from "../../.tina/__generated__/client"
import { useEffect } from "react"
import { TinaMarkdown } from "tinacms/dist/rich-text";

function reformatDate(fullDate) {
  const date = new Date(fullDate)
  return date.toDateString().slice(4)
}

export default function BlogTemplate(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })

  return (
    <Layout siteTitle={props.siteTitle}>
      <article className={styles.blog}>
        <figure className={styles.blog__hero}>
          <Image
            width="800"
            height="450"
            src={data.post ? data.post.hero_image : ""}
            alt={`blog_hero_${data.post ? data.post.title : "fallback title"}`}
          />
        </figure>
        <div className={styles.blog__info}>
          <h1>{data.post ? data.post.title : "Article Title Not found" }</h1>
          <h3>{reformatDate(data.post ? data.post.date : "NO DATE")}</h3>
        </div>
        <div className={styles.blog__body}>
          <TinaMarkdown content={data.post ? data.post.body : ""} />
        </div>
      </article>
    </Layout>
  )
}

export async function getStaticProps(context) {
  // extracting the slug from the context
  const { slug } = context.params
  const config = await import(`../../data/config.json`)

  let data = {}
  let query = {}
  let variables = { relativePath: `${slug}.md` }
  try {
    const res = await client.queries.post(variables)
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

export async function getStaticPaths() {
  // getting all .md files from the posts directory
  const blogs = glob.sync(`content/posts/**/*.md`)

  // converting the file names to their slugs
  const blogSlugs = blogs.map(file =>
    file
      .split('/')[1]
      .replace(/ /g, '-')
      .slice(0, -3)
      .trim()
  )

  // creating a path for each of the `slug` parameter
  const paths = blogSlugs.map(slug => { return { params: { slug: slug } } })

  return {
    paths,
    fallback: false,
  }
}