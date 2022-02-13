import * as React from 'react'
import styled, { CSSProp } from 'styled-components'
import { Color, createVariant, theme } from '../system'

const gridVariant = createVariant({
  name: 'Grid',
  transforms: {
    width: (value: number | string) => value,
    minWidth: (value: number | string) => value,
    maxWidth: (value: number | string) => value,
    height: (value: number | string) => value,
    minHeight: (value: number | string) => value,
    maxHeight: (value: number | string) => value,
    column: (value: number | string) => ({ gridColumn: value }),
    row: (value: number | string) => ({ gridRow: value }),
    columns: (value: string) => ({ '--grid-columns': value }),
    margin: (value: string) => ({ '--grid-margin': value }),
    background: (value: Color) => theme.colors[value] || value,
  },
  variants: {},
})

export type GridStyleProps = {
  column?: string
  columns?: string
  row?: string
  rows?: string
  width?: number | string
  minWidth?: number | string
  maxWidth?: number | string
  height?: number | string
  minHeight?: number | string
  maxHeight?: number | string
  margin?: number | string
  background?: Color
}

export type GridProps = {
  $debugBaseline?: boolean
  $debugColumns?: boolean
  children?: React.ReactNode
} & GridStyleProps

const StyledGrid = styled.div<GridProps>(
  (props) => gridVariant.getStyleProps(props),
  ({ $debugBaseline, $debugColumns }) => {
    let styles: CSSProp = {
      display: 'grid',
      minHeight: '100vh',
      gridTemplateColumns: `var(--grid-margin) var(--grid-columns) var(--grid-margin)`,
    }

    if ($debugBaseline || $debugColumns) {
      styles.pointerEvents = `none`
      if ($debugBaseline) {
        styles = {
          ...styles,
          backgroundSize: `100% 0.25rem`,
          backgroundImage: `linear-gradient(to bottom, #25cef4 0px, transparent 1px)`,
        }
      }
    } else {
      styles = {
        ...styles,
        gridAutoRows: `min-content`,
        '> *': { gridColumn: `2/-2` },
      }
    }

    return styles
  }
)

const StyledDebugGrid = styled.div<{ $active: boolean }>(
  {
    display: 'grid',
    '> *': { gridArea: '1 / 1 / 1 / 1' },
  }
  // (props) => {
  //   return props.$active
  //     ? { '*': { backgroundColor: 'rgba(0,0,200,0.05)' } }
  //     : {}
  // }
)

const StyledDebugColumn = styled.div<{ $index: number }>((props) => ({
  background: [0, 13].includes(props.$index) ? '#ffc15012' : undefined,
  boxShadow: '0 0 0 1px #b6fcff6e',
  //   display: props.$index <= 5 ? 'none' : 'block',
  //   [gridBreakpoints.medium]: {
  //     display: 'block',
  //   },
}))

function DebugGrid({ children, ...props }: GridProps) {
  const [debugBaseline, setDebugBaseline] = React.useState(false)
  const [debugColumns, setDebugColumns] = React.useState(true)

  React.useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.metaKey && event.key === 'b') {
        event.preventDefault()
        setDebugBaseline((bool) => !bool)
      }
      if (event.metaKey && event.key === 'g') {
        event.preventDefault()
        setDebugColumns((bool) => !bool)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  if (debugBaseline === false && debugColumns === false) {
    return <React.Fragment>{children}</React.Fragment>
  }

  return (
    <StyledDebugGrid $active={debugBaseline || debugColumns}>
      {children}
      <StyledGrid
        $debugColumns={debugColumns}
        $debugBaseline={debugBaseline}
        {...props}
      >
        {debugColumns &&
          Array(14)
            .fill(0)
            .map((_, index) => (
              <StyledDebugColumn key={index} $index={index} />
            ))}
      </StyledGrid>
    </StyledDebugGrid>
  )
}

export const Grid = (props: GridProps) => (
  <DebugGrid {...props}>
    <StyledGrid {...props} />
  </DebugGrid>
)
