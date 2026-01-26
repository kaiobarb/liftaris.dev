import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Canvas from '../components/Canvas'
import BlogList from '../components/BlogList'
import Header from '../components/Header'
import Footer from '../components/Footer'
import styles from '../styles/Layout.module.css'
import type { Metadata } from 'next'

interface BlogPost {
  frontmatter: {
    title: string
    date: string
    hero_image: string
    [key: string]: unknown
  }
  markdownBody: string
  filename: string
}

async function getSiteConfig() {
  const config = await import('../data/config.json')
  return { title: config.title, description: config.description }
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))

  return filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const document = matter(fileContents)

    return {
      frontmatter: {
        ...document.data,
        date: document.data.date instanceof Date
          ? document.data.date.toISOString()
          : document.data.date,
      } as BlogPost['frontmatter'],
      markdownBody: document.content,
      filename: filename.replace(/\.md$/, ''),
    }
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig()
  return { title: config.title, description: config.description }
}

export default async function HomePage() {
  const [allBlogs, config] = await Promise.all([
    getBlogPosts(),
    getSiteConfig(),
  ])

  return (
    <section className={styles.layout}>
      <div className={styles.content}>
        <Header siteTitle={config.title} />
        <section style={{ flex: 1, display: "flex", justifyItems: "stretch" }}>
          <Canvas />
        </section>
        <section style={{ backgroundColor: "black" }}>
          <BlogList allBlogs={allBlogs} />
        </section>
      </div>
      <Footer />
    </section>
  )
}
