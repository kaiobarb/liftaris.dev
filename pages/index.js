import matter from 'gray-matter'
import Layout from '../components/Layout'
import BlogList from '../components/BlogList'
import Canvas from '../components/Canvas'

const Index = props => {

  return (
    <Layout
      pathname="/"
      siteTitle={props.title}
      siteDescription={props.description}
    >
      <section style={{flex: 1, display:"flex", justifyItems:"stretch"}}>
        <Canvas />
      </section>
      <section style={{backgroundColor:"black"}}>
        <BlogList allBlogs={props.allBlogs}/>
      </section>
    </Layout>
  )
}

export default Index

export async function getStaticProps() {
  const siteConfig = await import(`../data/config.json`)

  const webpackContext = require.context("../content/posts", true, /\.md$/)
  // the list of file names contained
  // inside the "posts" directory
  const keys = webpackContext.keys()
  const values = keys.map(webpackContext)

  // getting the post data from the files contained
  // in the posts folder
  const posts = keys.map((key, index) => {
    // dynamically creating the post slug
    // from the file name
    const filename = key
      .replace(/^.*[\\\/]/, "")
      .split(".")
      .slice(0, -1)
      .join(".")

    //getting the .md file value associated with the current file name
    const value = values[index]
  
    //parsing the YAML metadata and markdown body contained in the .md file
    const document = matter(value.default)

    return {
      frontmatter: document.data,
      markdownBody: document.content,
      filename,
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
