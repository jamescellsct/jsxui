import { createSystem } from '@jsxui/system'

export const { collectStyles, createVariant, theme } = createSystem({
  mediaQueries: {
    small: '(min-width: 0px)',
    medium: '(min-width: 720px)',
    large: '(min-width: 1280px)',
    dark: '(prefers-color-scheme: dark)',
  },
  colors: {
    foreground: { initial: '#000', dark: '#fff' },
    background: {
      initial: `linear-gradient(200deg, #8b57df 15.17%, #5d4387 87.41%) no-repeat`,
      dark: '#000',
    },
    primary: 'blue',
  },
  fontSizes: {
    heading1: { initial: 40, medium: 60, large: 80 },
  },
})

export type Color = keyof typeof theme.colors

export type FontSize = keyof typeof theme.fontSizes
