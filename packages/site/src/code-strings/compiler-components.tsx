type TextProps = {
  color: ThemeValue['colors']
}

const Text = createComponent<TextProps>({
  defaults: {
    color: 'foreground',
  },
  transforms: {
    color: (value, theme) => theme.colors[value],
  },
  variants: {
    heading1: {
      defaults: {
        size: 'large',
      },
      web: {
        as: 'h1',
      },
      native: {
        as: 'Text',
        accessibilityRole: 'header',
      },
    },
  },
  platforms: {
    web: {
      as: 'span',
    },
    native: {
      as: 'Text',
    },
  },
})
