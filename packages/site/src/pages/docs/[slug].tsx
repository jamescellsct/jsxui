import * as React from 'react'
import Link from 'next/link'
import { getMDXComponent } from 'mdx-bundler/client'
import { Layout } from '@/components/Layout'
import { getAllDocs } from '@/utils/get-all-docs'
import { Spacer, Stack, Text } from 'system'

// const components = {
//   h1: ({ children }) => <Text variant="heading1">{children}</Text>,
//   h2: ({ children }) => <Text variant="heading2">{children}</Text>,
//   h3: ({ children }) => <Text variant="heading3">{children}</Text>,
//   p: ({ children }) => <Text variant="body1">{children}</Text>,
// }

const components = {
  wrapper: ({ children }) => (
    <div
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        color: 'white',
        minHeight: '100vh',
      }}
    >
      {children}
    </div>
  ),
  h1: ({ children }) => <h1 css={{ fontSize: 48, margin: 0 }}>{children}</h1>,
  h2: ({ children }) => <h2 css={{ fontSize: 32, margin: 0 }}>{children}</h2>,
  h3: ({ children }) => <h3 css={{ fontSize: 24, margin: 0 }}>{children}</h3>,
  p: ({ children }) => (
    <p css={{ fontSize: 20, lineHeight: 1.4, margin: 0 }}>{children}</p>
  ),
  pre: ({ children }) => (
    <pre
      css={{
        padding: 16,
        margin: 0,
        borderRadius: 8,
        backgroundColor: 'rgb(37, 39, 54)',
      }}
    >
      {children}
    </pre>
  ),
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
      {/* <Stack width={[['breakpoints.medium', 'container.medium']]}>
        <Component components={components} />
      </Stack> */}
      <Stack width="1fr">
        <Component components={components} />
      </Stack>
      <Spacer size={64} />
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
