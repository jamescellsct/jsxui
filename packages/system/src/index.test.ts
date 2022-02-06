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
    color: 'foregrounds',
  },
  variants: {
    heading1: {
      as: 'h1',
      fontSize: { initial: 40, medium: 48, large: 60 },
    },
    body: {
      as: { initial: 'p', descendant: 'span', foo: 'bar' },
      fontSize: 16,
    },
    link: {
      // as: 'a',
      color: { hover: 'foregroundInteractive' },
    },
  },
})

test('collecting all variant styles', () => {
  expect(collectStyles()).toMatchSnapshot()
})

test('collecting single variant styles', () => {
  expect(textVariant.getProps('heading1')).toMatchSnapshot()
})

test('variant attribute states', () => {
  const props = textVariant.getProps('body', { descendant: true })
  expect(props.attributes.as).toEqual('span')
})

test('variant style alias', () => {
  const props = textVariant.getProps('body')
  expect(props.styles.color).toEqual('var(--colors-foreground)')
})

test('variant style states', () => {
  const props = textVariant.getProps('link', { hover: true })
  expect(props.styles.color).toEqual('foregroundInteractive')
})

// Collect styles: createGlobalStyle(collectVariants())
// :root {
//   --colors-foreground: #000;
//   --colors-background: #fff;
//   --colors-active: blue;
//   --font-size-heading1: 40px;
//   --font-size-body: 16px;
// }

// @media (prefers-color-scheme: dark) {
//   :root {
//     --colors-foreground: #fff;
//     --colors-background: #000;
//   }
// }

// Apply to components: styled.p.atts(textVariant.getAttributes) <Text variant="link" />
// .link {
//   color: var(--colors-foreground);
// }

// .link:hover {
//   --colors-foreground: var(--colors-active);
// }

// const transform = {
//   color: (value) => ({
//     initial: { color: value },
//     hover: { ':hover': { color: value } },
//   }),
// }

// const stateTransform = {
//   color: (value) => ({
//     hover: { ':hover': value },
//   }),
// }

// textVariantWithAlternateDefaults = textVariant.defaults() // set new defaults
// textVariant.override() // add overrides to variants

// const styles = collectStyles() { heading1, body }
// const styles = collectStyles('heading1')

// const collectAllVariantsStyles = {
//   '--heading1-font-size': '40px',
//   '@media (min-width: 720px)': { '--heading1-font-size': '48px' },
//   '@media (min-width: 1280px)': { '--heading1-font-size': '60px' },
// }

// const collectSingleVariantsStyles = {
//   '--heading1-font-size': '40px',
//   '@media (min-width: 720px)': { '--heading1-font-size': '48px' },
//   '@media (min-width: 1280px)': { '--heading1-font-size': '60px' },
// }

// const themeStyleSheetObject = {
//   '--colors-foreground': theme.colors.foreground.initial,
//   '@media (prefers-color-scheme: dark)': {
//     '--colors-foreground': theme.colors.foreground.dark,
//   },
// }

// const themeStyleSheetString = `
// .theme {
//   --colors-foreground: #000;
// }
// @media (prefers-color-scheme: dark) {
//   --colors-foreground: #fff;
// }
// `

// collect styles returns a sorted array of styles
//

// const themeValue = getThemeValue()

// const GlobalStyles = createGlobalStyle(themeStyleSheetObject)

// function ThemeProvider(theme) {
//   useEffect(() => {
//     getThemeClassName(theme)
//   }, [theme])

//   return <div className={}>{children}</div>
// }
