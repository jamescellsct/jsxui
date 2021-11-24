import * as React from 'react'
import Link from 'next/link'
import { getMDXComponent } from 'mdx-bundler/client'
import { Layout } from '@/components/Layout'
import { getAllDocs } from '@/utils/get-all-docs'
import { Spacer, Stack, Text } from 'system'

const components = {
  h1: ({ children }) => <Text variant="heading1">{children}</Text>,
  h2: ({ children }) => <Text variant="heading2">{children}</Text>,
  h3: ({ children }) => <Text variant="heading3">{children}</Text>,
  p: ({ children }) => <Text variant="body1">{children}</Text>,
}

export default function MDXLayout({ allDocs, doc }) {
  const Component = React.useMemo(() => getMDXComponent(doc.mdx), [doc.mdx])
  return (
    <Layout>
      <Stack width={320}>
        {allDocs.map(({ slug, name }) => (
          <Link href={slug} passHref>
            <Stack as="a" css={{ textDecoration: 'none' }}>
              <Spacer size={4} />
              <Stack axis="x">
                <Spacer size={16} />
                <Text variant="body2">{name}</Text>
                <Spacer size={16} />
              </Stack>
              <Spacer size={4} />
            </Stack>
          </Link>
        ))}
      </Stack>
      <Spacer size={64} />
      <Stack width={[['breakpoints.medium', 'container.medium']]}>
        <Component components={components} />
      </Stack>
      <Spacer />
    </Layout>
  )
}

export async function getStaticPaths() {
  const allDocs = await getAllDocs()
  return {
    paths: allDocs.map(({ slug }) => ({ params: { slug } })),
    fallback: false,
  }
}

export async function getStaticProps(context) {
  const allDocs = await getAllDocs()
  const doc = allDocs.find(({ slug }) => slug === context.params.slug)
  return { props: { allDocs, doc } }
}
