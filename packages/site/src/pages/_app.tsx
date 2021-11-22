import { MDXProvider } from '@mdx-js/react'
import { Spacer, Stack, Text, Theme } from 'system'

import '../app.css'

const components = {
  wrapper: ({ children }) => (
    <Theme value="prose">
      <Stack axis="x">
        <Spacer />
        <Stack width={[['breakpoints.medium', 'container.medium']]}>
          {children}
        </Stack>
        <Spacer />
      </Stack>
    </Theme>
  ),
  h1: ({ children }) => <Text variant="heading1">{children}</Text>,
  h2: ({ children }) => <Text variant="heading2">{children}</Text>,
  h3: ({ children }) => <Text variant="heading3">{children}</Text>,
  p: ({ children }) => <Text variant="body1">{children}</Text>,
}

// <Text fontSize={[16, mediaQuery('above.large', 24)]}></Text>

export default function App({ Component, pageProps }) {
  return (
    <MDXProvider components={components}>
      <Component {...pageProps} />
    </MDXProvider>
  )
}
