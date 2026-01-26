import fs from "fs"
import path from "path"
import client from "../../../tina/__generated__/client"
import type { PostQuery, PostQueryVariables } from "../../../tina/__generated__/types"
import PostClient from "../../../components/tina/PostClient"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import styles from "../../../styles/Layout.module.css"
import type { Metadata } from 'next'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getSiteConfig() {
  const config = await import('../../../data/config.json')
  return { title: config.title }
}

async function getPostData(slug: string) {
  const variables: PostQueryVariables = { relativePath: `${slug}.md` }

  try {
    const res = await client.queries.post(variables)
    return {
      data: res.data,
      query: res.query,
      variables,
    }
  } catch {
    return {
      data: {} as PostQuery,
      query: '',
      variables,
    }
  }
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))

  return filenames.map(file => ({
    slug: file.replace(/\.md$/, '')
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const postData = await getPostData(slug)
  const config = await getSiteConfig()

  return {
    title: `${postData.data.post?.title || 'Post'} | ${config.title}`,
  }
}

export default async function BlogPost({ params }: PageProps) {
  const { slug } = await params
  const [postData, config] = await Promise.all([
    getPostData(slug),
    getSiteConfig(),
  ])

  return (
    <section className={styles.layout}>
      <div className={styles.content}>
        <Header siteTitle={config.title} />
        <PostClient {...postData} />
      </div>
      <Footer />
    </section>
  )
}
