import fs from "fs"
import path from "path"
import Image from "next/image"
import styles from "../../styles/Blog.module.css"
import Layout from "../../components/Layout"
import { useTina } from 'tinacms/dist/react'
import client from "../../tina/__generated__/client"
import { TinaMarkdown, TinaMarkdownContent, Components } from "tinacms/dist/rich-text"
import ThemeImage from "../../components/ThemeImage"
import type { GetStaticProps, GetStaticPaths } from 'next'
import type { PostQuery, PostQueryVariables } from "../../tina/__generated__/types"

function reformatDate(fullDate: string): string {
  console.log(fullDate)
  const date = new Date(fullDate)
  return date.toDateString().slice(4)
}

interface BlogTemplateProps {
  data: PostQuery
  query: string
  variables: PostQueryVariables
  siteTitle: string
}

const components: Components<{
  ThemeImage: { lightSrc: string; darkSrc: string; alt: string }
}> = {
  ThemeImage: (props) => (
    <ThemeImage lightSrc={props.lightSrc} darkSrc={props.darkSrc} alt={props.alt} />
  ),
}

export default function BlogTemplate(props: BlogTemplateProps) {
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
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<BlogTemplateProps> = async (context) => {
  const slug = context.params?.slug as string
  const config = await import('../../data/config.json')

  const variables: PostQueryVariables = { relativePath: `${slug}.md` }
  let data: PostQuery = {} as PostQuery
  let query = ''

  try {
    const res = await client.queries.post(variables)
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

export const getStaticPaths: GetStaticPaths = async () => {
  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))

  const paths = filenames.map(file => ({
    params: { slug: file.replace(/\.md$/, '') }
  }))

  return {
    paths,
    fallback: false,
  }
}
