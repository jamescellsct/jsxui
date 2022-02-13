import * as React from 'react'
import { useMedia } from 'react-media'
import { theme } from '../system'

export function useBreakpointValue(value) {
  const queries = useMedia({ queries: theme.mediaQueries })
  const activeQuery = Object.entries(queries).find(([, active]) => active)
  return typeof value === 'object'
    ? activeQuery
      ? value[activeQuery[0]]
      : null
    : value
}

export const DebugSpace = ({ isMainAxisHorizontal, size }) => {
  const propSize = useBreakpointValue(size)
  const [hover, setHover] = React.useState(false)
  const isFractional = typeof size === 'string' && size.includes('fr')
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      }}
    >
      {hover && (
        <React.Fragment>
          <svg
            width={isMainAxisHorizontal ? '100%' : isFractional ? 8 : 1}
            height={isMainAxisHorizontal ? (isFractional ? 8 : 1) : '100%'}
            style={{
              position: 'absolute',
              [isMainAxisHorizontal ? 'top' : 'left']: `calc(50% - ${
                isFractional ? 4 : 0.5
              }px)`,
              zIndex: 100,
            }}
          >
            {isFractional ? (
              <rect
                width="100%"
                height="100%"
                fill={`url(#${
                  isMainAxisHorizontal ? 'horizontal' : 'vertical'
                }Wave)`}
              />
            ) : (
              <rect width="100%" height="100%" fill="hotpink" />
            )}
          </svg>
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 100,
              backgroundColor: isMainAxisHorizontal
                ? 'hsla(214, 72%, 56%, 0.5)'
                : 'hsla(214, 84%, 74%, 0.5)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                backgroundColor: 'hotpink',
                color: 'white',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.8,
                padding: '2px 4px',
                whiteSpace: 'nowrap',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'default',
              }}
            >
              {propSize}
            </span>
          </div>
        </React.Fragment>
      )}
    </div>
  )
}
