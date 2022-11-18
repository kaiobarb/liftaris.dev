import Layout from '../components/Layout'
import BlogList from '../components/BlogList'

const Index = props => {
  return (
    <Layout
      pathname="/"
      siteTitle={props.title}
      siteDescription={props.description}
    >
      <section>
        <BlogList/>
      </section>
    </Layout>
  )
}

export default Index

export async function getStaticProps() {
  const siteConfig = await import(`../data/config.json`)

  return {
    props: {
      title: siteConfig.default.title,
      description: siteConfig.default.description,
    },
  }
}
