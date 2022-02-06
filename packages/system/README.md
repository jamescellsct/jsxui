# @jsxui/system

Utilities to configure your Design System for any framework or platform.

## Install

```bash
yarn add @jsxui/system
npm install @jsxui/system
```

## Get Started

This package ships with a helper function to create a design system configuration that returns contextually aware utilities.

After installing, import the helper function and create a design system configuration:

```ts
import { createSystem } from '@jsxui/system'

export const { createVariant, theme } = createSystem({
  mediaQueries: {
    small: '@media (min-width: 0px)',
    medium: '@media (min-width: 960px)',
    large: '@media (min-width: 1280px)',
    dark: '@media (prefers-color-scheme: dark)',
  },
  colors: {
    primary: { initial: '#0070f3' },
    secondary: '#ff4081',
    background: '#fafafa',
    foreground: '#212121',
  },
})

export type ColorValue = keyof typeof theme.colors
```
