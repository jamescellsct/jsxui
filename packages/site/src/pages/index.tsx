import * as React from 'react'
import { LiveProvider, LiveEditor } from 'react-live'
import NextLink from 'next/link'
import Highlight, { defaultProps } from 'prism-react-renderer'
import dracula from 'prism-react-renderer/themes/dracula'
import jsxuiPlugin from '@jsxui/babel-plugin/dist/compiler'
import { format } from 'prettier/standalone'
import tsParser from 'prettier/parser-typescript'
import { transform } from '@babel/standalone'

import { Spacer, Stack, Text } from 'system'
import * as system from 'system'

const codeString = `
export default function App({ active }) {
  return (
    <Stack>
      <Text color={[[active, "brand"]]}>Heading</Text>
      <Spacer
        size={[
          ["default", 8],
          ["breakpoints.medium", 16]
        ]}
      />
      <Stack
        axis={[
          ["breakpoints.medium", "x"]
        ]}
        background="brand"
      >
        <Text color="white">Content</Text>
      </Stack>
    </Stack>
  );
}
`

function parseCode(codeString, platform) {
  try {
    const { code } = transform(codeString, {
      plugins: [[jsxuiPlugin, { platform, ...system }]],
    })
    const formattedCode = format(code, {
      parser: 'typescript',
      plugins: [tsParser],
    })
    return formattedCode
  } catch (err) {
    console.log(err)
    return codeString
  }
}

function HighlightCode({ codeString }) {
  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      theme={dracula}
      language="jsx"
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={style}>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  )
}

export default function Code() {
  const [activePlatform, setActivePlatform] = React.useState('Web')
  const [code, setCode] = React.useState(codeString)
  const [parsedCode, setParsedCode] = React.useState(null)
  React.useEffect(() => {
    setParsedCode(parseCode(code, activePlatform.toLowerCase()))
  }, [activePlatform, code])
  return (
    <Stack height="100vh">
      <Stack axis="x" space={24} spaceBetween={24}>
        <Text>JSXUI</Text>
        <Spacer />
        <Text
          as="a"
          href="https://twitter.com/jsxui"
          css={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          Twitter
        </Text>
        <Text
          as="a"
          href="https://github.com/souporserious/jsxui"
          css={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          GitHub
        </Text>
      </Stack>
      <Stack>
        <Spacer size="200px" />
        <Stack axis="x">
          <Spacer />
          <Text
            variant="heading1"
            size={[
              ['default', 'medium'],
              ['breakpoints.medium', 'xlarge'],
            ]}
            alignment="center"
          >
            The Design Compiler
          </Text>
          <Spacer />
        </Stack>
        <Spacer size="64px" />
        <Stack axis="x">
          <Spacer />
          <NextLink href="/presentation" passHref>
            <Stack
              as="a"
              width="176px"
              variant="primaryLink"
              css={{ textDecoration: 'none' }}
            >
              <Spacer size="16px" />
              <Stack axis="x">
                <Spacer />
                <Text size="24px" css={{ cursor: 'pointer' }}>
                  Presentation
                </Text>
                <Spacer />
              </Stack>
              <Spacer size="16px" />
            </Stack>
          </NextLink>
          <Spacer />
        </Stack>
      </Stack>
      <Spacer size="80px" />
      <Stack
        axis={[
          ['default', 'y'],
          ['breakpoints.medium', 'x'],
        ]}
        height="1fr"
        background="surfaceDark"
        css={{
          fontSize: 20,
          overflow: 'auto',
        }}
      >
        <Stack width="1fr">
          <LiveProvider
            code={code}
            transformCode={(input) => {
              try {
                setCode(input)
                return parseCode(input, activePlatform)
              } catch (err) {
                console.log(err)
                return input
              }
            }}
            noInline
            theme={dracula}
            css={{ margin: 0 }}
          >
            <LiveEditor />
          </LiveProvider>
        </Stack>
        {parsedCode && (
          <Stack width="1fr">
            <HighlightCode codeString={parsedCode} />
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}
