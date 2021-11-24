import * as React from 'react'
import { createComponent } from '@jsxui/babel-plugin/dist/create-component'
import { theme } from '../theme'

export type TextProps = {
  width?: string
  size?: number | string
  weight?: number | string
  italic?: boolean
  alignment?: 'start' | 'center' | 'end'
  color?: string
  shadow?: string
  opacity?: number | string
  children: React.ReactNode
}

export const Text = createComponent<TextProps>({
  name: 'Text',
  defaults: {
    color: 'foreground',
  },
  transforms: {
    width: (value) => ({ width: theme.lineLengths[value] || value }),
    italic: (value) => (value ? { fontStyle: 'italic' } : undefined),
    size: (value) => {
      const systemFontSize = theme.fontSizes[value]
      return {
        fontSize: systemFontSize
          ? systemFontSize.default || systemFontSize
          : value,
      }
    },
    weight: (value) => {
      const systemFontWeight = theme.fontWeights[value]
      return {
        fontWeight: systemFontWeight
          ? systemFontWeight.default || systemFontWeight
          : value,
      }
    },
    alignment: (value) => ({ textAlign: value }),
    opacity: (value) => ({ opacity: value }),
    shadow: (value) => ({ filter: value }),
    color: (value) => ({ color: theme.colors[value] || value }),
  },
  variants: {
    heading1: {
      defaults: {
        textTransform: 'uppercase',
        lineHeight: '1.08',
        italic: true,
        size: 'xlarge',
        weight: 'black',
        shadow: `drop-shadow(-1px 3px #3d157d) drop-shadow(-1px 2px #3d157d) drop-shadow(-1px 2px #3d157d) drop-shadow(-1px 1px #3d157d) drop-shadow(-1px 1px #3d157d)`,
      },
      web: {
        as: 'h1',
      },
      native: {
        as: 'Text',
        accessibilityRole: 'header',
      },
    },
    heading2: {
      defaults: {
        textTransform: 'uppercase',
        lineHeight: '1.08',
        italic: true,
        size: 'large',
        weight: 'black',
        shadow: `drop-shadow(-1px 3px #3d157d) drop-shadow(-1px 2px #3d157d) drop-shadow(-1px 2px #3d157d) drop-shadow(-1px 1px #3d157d) drop-shadow(-1px 1px #3d157d)`,
      },
      web: {
        as: 'h2',
      },
      native: {
        as: 'Text',
        accessibilityRole: 'header',
      },
    },
    heading3: {
      defaults: {
        size: 'medium',
        color: 'foregroundSecondary',
      },
      web: {
        as: 'h3',
      },
      native: {
        as: 'Text',
        accessibilityRole: 'header',
      },
    },
    body1: {
      defaults: {
        size: 'medium',
        letterSpacing: 0.8,
      },
      web: {
        as: 'p',
      },
      native: {
        as: 'Text',
      },
    },
    body2: {
      defaults: {
        size: 'small',
        color: 'foregroundSecondary',
        letterSpacing: 0.8,
      },
      web: {
        as: 'p',
      },
      native: {
        as: 'Text',
      },
    },
  },
  platforms: {
    figma: {
      as: 'Text',
      source: 'react-figma',
    },
    ink: {
      as: 'Text',
      source: 'ink',
    },
    native: {
      as: 'Text',
      source: 'react-native',
    },
    web: {
      as: 'span',
      defaults: {
        whiteSpace: 'pre-wrap',
        margin: 0,
        cursor: 'default',
      },
    },
  },
})
