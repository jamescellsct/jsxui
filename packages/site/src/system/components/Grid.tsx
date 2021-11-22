import * as React from 'react'
import { createComponent } from '@jsxui/babel-plugin/dist/create-component'
import get from 'dlv'
import { theme } from '../theme'

export type GridProps = {
  column?: number
  row?: number
  columns: number
  rows: number
  width?: number | string
  height?: number | string
  children: React.ReactNode
}

const getValue = (value, key) => {
  return typeof value === 'number'
    ? value
    : theme[key]
    ? get(theme[key], value, value)
    : value
}

export const Grid = createComponent<GridProps>({
  name: 'Grid',
  transforms: {
    column: (value) => ({
      gridColumn: value,
    }),
    row: (value) => ({
      gridRow: value,
    }),
    columns: (value) => ({
      gridTemplateColumns: `repeat(${value}, minmax(0, 1fr))`,
    }),
    rows: (value) => ({
      gridTemplateRows: `repeat(${value}, minmax(0, 1fr))`,
    }),
    space: (value) => ({
      padding: getValue(value, 'space'),
      gridGap: getValue(value, 'space'),
    }),
    spaceBetweenX: (value) => ({
      gridColumnGap: getValue(value, 'space'),
    }),
    spaceBetweenY: (value) => ({
      gridRowGap: getValue(value, 'space'),
    }),
    width: (value) => ({
      width: getValue(value, 'boxSizes'),
    }),
    height: (value) => ({
      height: getValue(value, 'boxSizes'),
    }),
  },
  variants: {},
  platforms: {
    figma: {
      as: 'View',
      source: 'react-figma',
    },
    ink: {
      as: 'Box',
      source: 'ink',
      defaults: {
        flexDirection: 'column',
      },
    },
    native: {
      as: 'View',
      source: 'react-native',
    },
    web: {
      as: 'div',
      defaults: {
        display: 'grid',
        gridAutoColumns: 'minmax(0, 1fr)',
        gridAutoRows: 'minmax(0, 1fr)',
      },
    },
  },
})
