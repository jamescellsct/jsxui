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
    background: { initial: '#fff', dark: '#000' },
    primary: 'blue',
  },
})

export type Color = keyof typeof theme.colors
