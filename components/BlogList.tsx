import Link from "next/link"
import styles from "../styles/BlogList.module.css"
import Image from "next/image"

function reformatDate(fullDate: string): string {
  const date = new Date(fullDate)
  return date.toDateString().slice(4)
}

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

interface BlogListProps {
  allBlogs: BlogPost[]
}

export default function BlogList({ allBlogs }: BlogListProps) {
  return (
    <div className={styles.bloglist}>
      <div className={styles.bloglist__header}>
        <h2>
          Posts
        </h2>
      </div>
      <ul>
        {allBlogs && allBlogs.length > 0 &&
          allBlogs.map(post => (
            <li key={post.filename.split(' ').join()}>
              <Link href={{ pathname: `/blog/${post.filename}` }} className={styles.blog__link}>
                <div className={styles.hero_image}>
                  <Image
                    width={384}
                    height={288}
                    src={post.frontmatter.hero_image}
                    alt={post.frontmatter.hero_image}
                  />
                </div>
                <div className={styles.blog__info}>
                  <h2>{post.frontmatter.title}</h2>
                  <code>{reformatDate(post.frontmatter.date)}</code>
                </div>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  )
}
