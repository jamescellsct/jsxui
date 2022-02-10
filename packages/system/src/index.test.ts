import { createSystem } from './index'

const { collectStyles, createVariant, theme } = createSystem({
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
})

type ColorValue = keyof typeof theme.colors

const textVariant = createVariant({
  states: ['descendant', 'hover'],
  transforms: {
    fontSize: (value: number) => ({
      fontSize: value,
    }),
    color: (value: ColorValue) => ({
      color: theme.colors[value],
    }),
  },
  defaults: {
    color: 'foreground',
  },
  variants: {
    heading1: {
      as: 'h1',
      fontSize: { initial: 40, medium: 48, large: 60 },
    },
    body: {
      as: { initial: 'p', descendant: 'span' },
      fontSize: 16,
    },
    link: {
      as: 'a',
      color: { hover: 'foregroundInteractive' },
    },
  },
})

test('collecting all variant styles', () => {
  expect(collectStyles()).toMatchSnapshot()
})

test('collecting single variant styles', () => {
  expect(textVariant.getProps({ variant: 'heading1' })).toMatchSnapshot()
})

test('variant attribute states', () => {
  const props = textVariant.getProps({ variant: 'body' }, { descendant: true })
  expect(props.attributes.as).toEqual('span')
})

test('variant style alias', () => {
  const props = textVariant.getProps({ variant: 'body' })
  expect(props.styles.color).toEqual('var(--colors-foreground)')
})

test('variant style states', () => {
  const props = textVariant.getProps({ variant: 'body' }, { hover: true })
  expect(props.styles.color).toEqual('foregroundInteractive')
})
