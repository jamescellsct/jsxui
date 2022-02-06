import { createSystem } from './index'

const { createVariant, theme } = createSystem({
  mediaQueries: {
    small: '(min-width: 0px)',
    medium: '(min-width: 720px)',
    large: '(min-width: 1280px)',
    dark: '(prefers-color-scheme: dark)',
  },
  colors: {
    foreground: { initial: '#000', dark: '#fff' },
    background: { initial: '#fff', dark: '#000' },
    activeSecondary: 'blue',
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
      color: { hover: 'activeSecondary' },
    },
  },
})

test('collect local variant styles', () => {
  expect(textVariant.getProps('heading1')).toMatchSnapshot()
})

test('variant attribute states work', () => {
  const props = textVariant.getProps('body', { descendant: true })
  expect(props.attributes.as).toEqual('span')
})

test('variant style states work', () => {
  const props = textVariant.getProps('link', { hover: true })
  expect(props.styles.color).toEqual('activeSecondary')
})
