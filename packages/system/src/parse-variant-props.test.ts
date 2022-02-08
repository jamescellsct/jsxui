import { parseProps } from './parse-props'

const theme = {
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
}

const transforms = {
  color: (value) => ({ color: value }),
  fontSize: (value) => ({ fontSize: value }),
}

const variantProps = {
  as: {
    initial: 'p',
    descendant: 'span',
  },
  fontSize: {
    initial: 16,
    medium: 20,
    large: 24,
  },
  color: 'foreground',
}

const parsedVariantProps = {
  global: {
    initial: {
      '--font-size-heading1': '16px',
    },
    medium: {
      '--font-size-heading1': '24px',
    },
    large: {
      '--font-size-heading1': '32px',
    },
  },
  local: {
    fontSize: 'var(--font-size-heading1)',
    color: 'var(--color-foreground)',
  },
}

test('parses media and state props', () => {
  const parsedProps = parseProps({
    props: variantProps,
    states: { descendant: false, hover: false },
    transforms,
    theme,
  })

  expect(parsedProps).toMatchSnapshot()
})
