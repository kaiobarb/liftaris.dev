import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Layout from '../components/Layout'
import BlogList from '../components/BlogList'
import Canvas from '../components/Canvas'
import type { GetStaticProps } from 'next'

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

interface IndexProps {
  allBlogs: BlogPost[]
  title: string
  description: string
}

export default function Index({ allBlogs, title, description }: IndexProps) {
  return (
    <Layout
      pathname="/"
      siteTitle={title}
      siteDescription={description}
    >
      <section style={{flex: 1, display:"flex", justifyItems:"stretch"}}>
        <Canvas />
      </section>
      <section style={{backgroundColor:"black"}}>
        <BlogList allBlogs={allBlogs}/>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const siteConfig = await import('../data/config.json')

  const postsDirectory = path.join(process.cwd(), 'content/posts')
  const filenames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'))

  const posts: BlogPost[] = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const document = matter(fileContents)

    return {
      frontmatter: document.data as BlogPost['frontmatter'],
      markdownBody: document.content,
      filename: filename.replace(/\.md$/, ''),
    }
  })

  return {
    props: {
      allBlogs: posts,
      title: siteConfig.default.title,
      description: siteConfig.default.description,
    },
  }
}
