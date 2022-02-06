import type { ComplexValue } from '@jsxui/system'
import { createSystem } from '@jsxui/system'
import styled from 'styled-components'

export const { createVariant, theme } = createSystem({
  mediaQueries: {
    small: '(min-width: 0px)',
    medium: '(min-width: 720px)',
    large: '(min-width: 1280px)',
    dark: '(prefers-color-scheme: dark)',
  },
  colors: {
    foreground: { initial: '#000', dark: '#fff' },
    background: { initial: '#fff', dark: '#000' },
  },
})

type Color = keyof typeof theme.colors

export const textVariant = createVariant({
  states: ['descendant', 'hover'],
  transforms: {
    fontSize: (value: number) => ({
      fontSize: value,
    }),
    color: (value: Color) => ({
      color: theme.colors[value],
    }),
  },
  defaults: {
    variant: 'body',
  },
  variants: {
    heading1: {
      as: 'h1',
      fontSize: { initial: 40, medium: 48, large: 60 },
    },
    body: {
      as: { initial: 'p', descendant: 'span' },
      fontSize: 16,
      color: 'foreground',
    },
  },
})

type CreateVariantReturnType = ReturnType<
  ReturnType<typeof createSystem>['createVariant']
>

type VariantProps<T extends CreateVariantReturnType> = ReturnType<T['getProps']>

type StyleProps<T extends CreateVariantReturnType> = VariantProps<T>['styles']

type AttributeProps<T extends CreateVariantReturnType> =
  VariantProps<T>['attributes']

type TextAttributeProps = AttributeProps<typeof textVariant>

type TextStyleProps = StyleProps<typeof textVariant>

// export const Text = styled.p.attrs(({ variant }) => ({
//   as: textVariant.getProps(variant).attributes.as,
// }))<{ variant: string }>(textVariant.getProps)
