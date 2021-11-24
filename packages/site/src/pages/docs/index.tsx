import { Stack, Text } from 'system'
import Link from 'next/link'
import * as path from 'path'
import * as fs from 'fs'

export default function Docs({ links }) {
  return (
    <div>
      {links.map(({ name, href }) => (
        <Link key={href} href={href} passHref>
          <Stack as="a" css={{ textDecoration: 'none' }}>
            <Text variant="body2">{name}</Text>
          </Stack>
        </Link>
      ))}
    </div>
  )
}

export function getStaticProps() {
  const layoutsDirectory = path.join(process.cwd(), 'src/pages/docs')
  const files = fs.readdirSync(layoutsDirectory)
  return {
    props: {
      links: files
        .map((file) => file.replace('.mdx', ''))
        .filter((file) => file !== 'index.tsx')
        .map((file) => ({
          name: file,
          href: `/docs/${file}`,
        })),
    },
  }
}
