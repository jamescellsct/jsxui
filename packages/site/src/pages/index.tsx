import * as React from 'react'
import { LiveProvider, LiveEditor } from 'react-live'
import NextLink from 'next/link'
import Highlight, { defaultProps } from 'prism-react-renderer'
import dracula from 'prism-react-renderer/themes/dracula'
import jsxuiPlugin from '@jsxui/babel-plugin/dist/compiler'
import { format } from 'prettier/standalone'
import tsParser from 'prettier/parser-typescript'
import { transform } from '@babel/standalone'

import { Spacer, Stack, Text, theme } from 'system'
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

const platforms = ['Web', 'Ink', 'Native', 'Figma']

export default function Index() {
  const [activePlatform, setActivePlatform] = React.useState('Web')
  const [code, setCode] = React.useState(codeString)
  const [parsedCode, setParsedCode] = React.useState(null)

  React.useEffect(() => {
    setParsedCode(parseCode(code, activePlatform.toLowerCase()))
  }, [activePlatform, code])

  return (
    <Stack>
      <Stack axis="x" space={24} spaceBetween={24}>
        <Graphic name="logo" />
        <Spacer />
        <Text
          as="a"
          href="https://twitter.com/jsxui"
          css={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          {/* <Graphic name="twitter" /> */}
          Twitter
        </Text>
        <Text
          as="a"
          href="https://github.com/souporserious/jsxui"
          css={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          {/* <Graphic name="github" /> */}
          GitHub
        </Text>
      </Stack>
      <Stack>
        <Spacer
          size={[
            ['default', '80px'],
            ['breakpoints.medium', '50px'],
          ]}
        />
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
            The Design
            <br />
            Compiler
          </Text>
          <Spacer />
        </Stack>
        <Spacer size={24} />
        <Stack axis="x">
          <Spacer />
          <Text size={32} weight={600}>
            Coming Soon
          </Text>
          <Spacer />
        </Stack>
        <Spacer size="64px" />
        <Stack
          axis="x"
          css={{
            display: 'none',
            [theme.breakpoints.medium]: { display: 'flex' },
          }}
        >
          <Spacer />
          <Stack
            as="a"
            href="https://www.youtube.com/watch?v=RGQR79PbTFU"
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
          <Spacer size="16px" />
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
                  Slides
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
        height={[['breakpoints.medium', '1fr']]}
        background="surfaceDark"
      >
        <Stack width="1fr">
          <Stack axis="x" space={16}>
            <Text variant="heading2" size={32}>
              Input
            </Text>
            <Spacer size={16} />
            <Stack>
              <Spacer />
              <Stack
                spaceY={2}
                spaceX={4}
                background="#d142b0"
                cornerRadius={4}
              >
                <Text weight={500} letterSpacing={0.1}>
                  Editable
                </Text>
              </Stack>
              <Spacer />
            </Stack>
          </Stack>
          <Stack css={{ overflow: 'auto' }}>
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
            >
              <LiveEditor css={{ flex: 1 }} />
            </LiveProvider>
          </Stack>
        </Stack>
        <Stack width="1fr">
          <Stack axis="x" space={16} spaceBetween={8}>
            <Text variant="heading2" size={32}>
              Output
            </Text>
            <Spacer size={16} />
            {/* {platforms.map((platform) => (
                <Stack
                  key={platform}
                  as="button"
                  spaceX="small"
                  spaceY="xsmall"
                  background={[
                    ['default', 'transparent'],
                    [platform === activePlatform, '#5c31a0'],
                  ]}
                  onClick={() => setActivePlatform(platform)}
                >
                  <Text key={platform}>{platform}</Text>
                </Stack>
              ))} */}
          </Stack>
          {parsedCode === null ? (
            <Stack padding={16}>
              <Text>Loading...</Text>
            </Stack>
          ) : (
            <Stack css={{ overflow: 'auto' }}>
              <HighlightCode codeString={parsedCode} />
            </Stack>
          )}
        </Stack>
      </Stack>
    </Stack>
  )
}
