import Head from 'next/head'

interface MetaProps {
  siteTitle?: string
  siteDescription?: string
}

export default function Meta({ siteTitle, siteDescription }: MetaProps) {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="utf-8" />
      <title>{siteTitle}</title>
      <meta name="Description" content={siteDescription}></meta>
    </Head>
  )
}
