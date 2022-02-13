import type { ReactHTML } from 'react'
import { createSystem } from './index'

export const { collectStyles, createVariant, theme } = createSystem({
  mediaQueries: {
    small: '(min-width: 0px)',
    medium: '(min-width: 720px)',
    large: '(min-width: 1280px)',
    dark: '(prefers-color-scheme: dark)',
  },
  colors: {
    foreground: { initial: '#000', dark: '#fff' },
    foregroundInteractive: 'blue',
    background: { initial: '#fff', dark: '#000' },
  },
  fontSizes: {
    small: { initial: '14px', medium: '16px', large: '18px' },
    medium: { initial: '16px', medium: '20px', large: '24px' },
    large: { initial: '20px', medium: '24px', large: '32px' },
    xlarge: { initial: '32px', medium: '40px', large: '60px' },
  },
})

type Color = keyof typeof theme.colors
type FontSize = keyof typeof theme.fontSizes

export const textAttributes = createVariant({
  transforms: { as: (value: keyof ReactHTML) => value },
  states: ['descendant'],
  variants: {
    heading1: { as: 'h1' },
    heading2: { as: 'h2' },
    body: { as: { initial: 'p', descendant: 'span' } },
    link: { as: 'a' },
  },
})

export const textStyles = createVariant({
  transforms: {
    fontSize: (value: FontSize | number) => theme.fontSizes[value] || value,
    color: (value: Color) => theme.colors[value] || value,
  },
  defaults: {
    color: 'foreground',
    variant: 'body',
  },
  variants: {
    heading1: { fontSize: 'xlarge' },
    heading2: { fontSize: 'large' },
    body: { fontSize: 24 },
    link: { color: { hover: 'foregroundInteractive' } },
  },
})

const gridStyles = createVariant({
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
  variants: {}, // TODO: variants shouldn't be required, but is giving type trouble when adding a default empty object
})

test('collecting all variant styles', () => {
  expect(collectStyles()).toMatchSnapshot()
})

test('collecting single variant styles', () => {
  expect(textStyles.getStyleProps({ variant: 'heading1' })).toMatchSnapshot()
})

test('variant attribute states', () => {
  const props = textAttributes.getStateProps(
    { variant: 'body' },
    { descendant: true }
  )
  expect(props.as).toEqual('span')
})

test('variant style alias', () => {
  const props = textStyles.getStyleProps({ variant: 'body' })
  expect(props.color).toEqual('var(--colors-foreground)')
})

test('media query prop styles', () => {
  const props = gridStyles.getStyleProps({
    width: {
      medium: '100%',
    },
    columns: {
      initial: 'repeat(6, minmax(0, 1fr))',
      medium: 'repeat(12, minmax(0, 1fr))',
      large: 'repeat(12, 100px)',
    },
    margin: {
      small: 16,
      medium: 32,
      large: '1fr',
    },
    background: 'background',
  })
  expect(props).toMatchSnapshot()
})

// test('variant style states', () => {
//   const props = textStyles.getStyleProps({ variant: 'body' }, { hover: true })
//   expect(props.styles.color).toEqual('foregroundInteractive')
// })
