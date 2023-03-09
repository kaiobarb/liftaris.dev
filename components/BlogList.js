import Link from "next/link"
import styles from "../styles/BlogList.module.css"
import Image from "next/image"

function truncateSummary(content) {
  return content.slice(0, 200).trimEnd()
}

function reformatDate(fullDate) {
  const date = new Date(fullDate)
  return date.toDateString().slice(4)
}

const BlogList = ({ allBlogs }) => {
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

export default BlogList