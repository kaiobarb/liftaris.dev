

import Image from "next/image"
import matter from "gray-matter"
import ReactMarkdown from "react-markdown"
import styles from "../../styles/Blog.module.css"
import glob from "glob"
import Layout from "../../components/Layout"

function reformatDate(fullDate) {
  const date = new Date(fullDate)
  return date.toDateString().slice(4)
}

export default function BlogTemplate({ frontmatter, markdownBody, siteTitle }) {
  return (
    <Layout siteTitle={siteTitle}>
      <article className={styles.blog}>
        <figure className={styles.blog__hero}>
          <Image
            width="1920"
            height="1080"
            src={frontmatter.hero_image}
            alt={`blog_hero_${frontmatter.title}`}
          />
        </figure>
        <div className={styles.blog__info}>
          <h1>{frontmatter.title}</h1>
          <h3>{reformatDate(frontmatter.date)}</h3>
        </div>
        <div className={styles.blog__body}>
          <ReactMarkdown>{markdownBody}</ReactMarkdown>
        </div>
        <h2 className={styles.blog__footer}>Written By: {frontmatter.author}</h2>
      </article>
    </Layout>
  )
}

export async function getStaticProps(context) {
  // extracting the slug from the context
  const { slug } = context.params
  const config = await import(`../../data/config.json`)

  // retrieving the Markdown file associated to the slug
  // and reading its data
  const content = await import(`../../posts/${slug}.md`)
  const data = matter(content.default)

  return {
    props: {
      siteTitle: config.title,
      frontmatter: data.data,
      markdownBody: data.content,
    },
  }
}

export async function getStaticPaths() {
  // getting all .md files from the posts directory
  const blogs = glob.sync(`posts/**/*.md`)

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