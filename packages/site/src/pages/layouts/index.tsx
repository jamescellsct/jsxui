import { Grid, Stack, Text } from 'system'
import Link from 'next/link'
import * as path from 'path'
import * as fs from 'fs'

function LayoutLink({ href, name }: { href: string; name: string }) {
  return (
    <Link href={href} passHref>
      <Stack as="a" css={{ textDecoration: 'none' }}>
        <Text variant="heading2">{name}</Text>
        <iframe
          src={href}
          css={{
            width: 400,
            aspectRatio: '16 / 9',
            border: 'none',
            pointerEvents: 'none',
          }}
        />
      </Stack>
    </Link>
  )
}

export default function Layouts({ links }) {
  return (
    <div>
      <Stack>
        <Text>Link</Text>
      </Stack>
      {links.map(({ name, href }) => (
        <LayoutLink key={href} name={name} href={href} />
      ))}
    </div>
  )
}

export function getStaticProps() {
  const layoutsDirectory = path.join(process.cwd(), 'src/pages/layouts')
  const files = fs.readdirSync(layoutsDirectory)
  return {
    props: {
      links: files
        .map((file) => file.replace('.tsx', ''))
        .filter((file) => file !== 'index')
        .map((file) => ({
          name: file,
          href: `/layouts/${file}`,
        })),
    },
  }
}
