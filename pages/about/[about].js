

import styles from "../../styles/Blog.module.css"
import Layout from "../../components/Layout"
import { useTina } from 'tinacms/dist/react'
import { TinaMarkdown } from "tinacms/dist/rich-text";

function reformatDate(fullDate) {
  const date = new Date(fullDate)
  return date.toDateString().slice(4)
}

export default function AboutTemplate(props) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  })

  return (
    <Layout siteTitle={"KAIO"}>
      <article className={styles.blog}>
        <div className={styles.blog__info}>
          <h1>{data.post.title}</h1>
        </div>
        <div className={styles.blog__body}>
          <TinaMarkdown content={data.post.body} />
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
  let variables = { relativePath: 'about.md' }
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

// export async function getStaticPaths() {
//   // getting all .md files from the posts directory
//   const blogs = glob.sync(`posts/**/*.md`)

//   // converting the file names to their slugs
//   const blogSlugs = blogs.map(file =>
//     file
//       .split('/')[1]
//       .replace(/ /g, '-')
//       .slice(0, -3)
//       .trim()
//   )

//   // creating a path for each of the `slug` parameter
//   const paths = blogSlugs.map(slug => { return { params: { slug: slug } } })

//   return {
//     paths,
//     fallback: false,
//   }
// }