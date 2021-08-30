import * as React from 'react'
import { createComponent } from '@jsxui/babel-plugin/dist/create-component'
import get from 'dlv'
import { theme } from '../theme'

export type StackProps = {
  axis?: 'x' | 'y'
  width?: number | any
  height?: number | any
  space?: number | string
  spaceX?: number | string
  spaceXStart?: number | string
  spaceXEnd?: number | string
  spaceY?: number | string
  spaceYStart?: number | string
  spaceYEnd?: number | string
  spaceBetween?: number | string
  cornerRadius?: number | string
  cornerTopStartRadius?: number | string
  cornerTopEndRadius?: number | string
  cornerBottomStartRadius?: number | string
  cornerBottomEndRadius?: number | string
  background?: string
  children: React.ReactNode
}

const getValue = (value, key) => {
  return typeof value === 'number'
    ? value
    : theme[key]
    ? get(theme[key], value, value)
    : value
}

export const Stack = createComponent<StackProps>({
  name: 'Stack',
  transforms: {
    axis: (value) => ({
      flexDirection: value === 'x' ? 'row' : 'column',
    }),
    width: (value) =>
      typeof value === 'string' && value.includes('fr')
        ? {
            flex: `${value.slice(0, -2)} ${value.slice(0, -2)} 0`,
          }
        : {
            width: getValue(value, 'boxSpacings'),
          },
    height: (value) =>
      typeof value === 'string' && value.includes('fr')
        ? {
            flex: `${value.slice(0, -2)} ${value.slice(0, -2)} 0`,
          }
        : {
            height: getValue(value, 'boxSpacings'),
          },
    space: (value) => ({
      padding: getValue(value, 'boxSpacings'),
    }),
    spaceX: (value) => ({
      paddingLeft: getValue(value, 'boxSpacings'),
      paddingRight: getValue(value, 'boxSpacings'),
    }),
    spaceXStart: (value) => ({
      paddingLeft: getValue(value, 'boxSpacings'),
    }),
    spaceXEnd: (value) => ({
      paddingRight: getValue(value, 'boxSpacings'),
    }),
    spaceY: (value) => ({
      paddingTop: getValue(value, 'boxSpacings'),
      paddingBottom: getValue(value, 'boxSpacings'),
    }),
    spaceYStart: (value) => ({
      paddingTop: getValue(value, 'boxSpacings'),
    }),
    spaceYEnd: (value) => ({
      paddingBottom: getValue(value, 'boxSpacings'),
    }),
    spaceBetween: (value) => ({
      gap: value,
    }),
    cornerRadius: (value) => ({
      borderRadius: value,
    }),
    cornerTopStartRadius: (value) => ({
      borderTopLeftRadius: value,
    }),
    cornerTopEndRadius: (value) => ({
      borderTopRightRadius: value,
    }),
    cornerBottomStartRadius: (value) => ({
      borderBottomLeftRadius: value,
    }),
    cornerBottomEndRadius: (value) => ({
      borderBottomRightRadius: value,
    }),
    background: (value) => ({
      background: theme.colors[value] || value,
    }),
  },
  variants: {
    primaryLink: {
      defaults: {
        background: 'brandShade',
        cornerRadius: 16,
      },
      web: {
        as: 'a',
        textDecoration: 'none',
      },
    },
    primaryButton: {
      defaults: {
        background: 'brandShade',
        cornerRadius: 16,
      },
      web: {
        as: 'button',
      },
    },
  },
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
        display: 'flex',
        flexDirection: 'column',
      },
    },
  },
})
