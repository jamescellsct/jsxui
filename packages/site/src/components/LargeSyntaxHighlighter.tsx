import * as React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'

export function LargeSyntaxHighlighter({
  codeString,
  metaString,
}: {
  codeString: string
  metaString?: string
}) {
  const linesToHighlight = metaString
    ?.split(' ')
    .find((part) => part.startsWith('{') && part.endsWith('}'))
  const shouldHighlightLine = calculateLinesToHighlight(linesToHighlight)
  return (
    <Highlight
      {...defaultProps}
      code={codeString}
      language="typescript"
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div
          css={{
            backgroundColor: theme.plain.backgroundColor,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <pre
            className={className}
            css={{
              fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
              fontSize: '2em',
              padding: '2em',
              margin: 0,
            }}
          >
            {tokens.map((line, index) => (
              <div
                {...getLineProps({ line, key: index })}
                css={{
                  display: 'flex',
                  backgroundColor: shouldHighlightLine(index)
                    ? '#5c31a0'
                    : undefined,
                }}
              >
                <span
                  css={{
                    display: 'inline-block',
                    width: '3ch',
                    flexShrink: 0,
                    padding: '0 0.5ch',
                    marginRight: '1ch',
                    textAlign: 'right',
                    borderLeft: '0.25em solid',
                    borderLeftColor: shouldHighlightLine(index)
                      ? 'rgb(173, 219, 103)'
                      : 'transparent',
                    backgroundColor: shouldHighlightLine(index)
                      ? '#8248de'
                      : theme.plain.backgroundColor,
                    color: 'rgba(255,255,255,0.46)',
                    userSelect: 'none',
                    position: 'sticky',
                    left: 0,
                  }}
                >
                  {index + 1}
                </span>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  )
}

const RE = /{([\d,-]+)}/

export function calculateLinesToHighlight(meta) {
  if (RE.test(meta)) {
    const lineNumbers = RE.exec(meta)[1]
      .split(',')
      .map((v) => v.split('-').map((y) => parseInt(y, 10)))
    return (index) => {
      const lineNumber = index + 1
      const inRange = lineNumbers.some(([start, end]) =>
        end ? lineNumber >= start && lineNumber <= end : lineNumber === start
      )
      return inRange
    }
  } else {
    return () => false
  }
}
