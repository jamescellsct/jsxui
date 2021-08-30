import * as React from 'react'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'

import { format } from '../utils/format'

export function SyntaxHighlighter({
  codeString,
  metaString,
  fontSize = '0.9em',
  showNumbers = true,
  printWidth = 50,
  className: parentClassName,
}: {
  codeString: string
  metaString?: string
  fontSize?: string
  showNumbers?: boolean
  printWidth?: number
  className?: string
}) {
  const linesToHighlight = metaString
    ?.split(' ')
    .find((part) => part.startsWith('{') && part.endsWith('}'))
  const shouldHighlightLine = calculateLinesToHighlight(linesToHighlight)
  return (
    <Highlight
      {...defaultProps}
      code={format(codeString, printWidth)}
      language="typescript"
      theme={theme}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <div
          css={{
            backgroundColor: theme.plain.backgroundColor,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            padding: '2em',
            borderRadius: '2em',
            boxShadow: '0px 20px 12px -12px rgb(68 41 111 / 80%)',
          }}
          className={parentClassName}
        >
          <pre
            className={className}
            css={{
              fontSize,
              fontFamily: `Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace`,
              margin: 0,
            }}
            style={style}
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
                {showNumbers && (
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
                )}
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
