import { createContext, useContext } from 'react'
import type { AttributeProps, StyleProps } from '@jsxui/system'
import styled from 'styled-components'
import type { Color } from '../system'
import { createVariant, collectStyles, theme } from '../system'

// Notes:
// createVariant is a weird name since you might not need variants (Stack/Grid), maybe move back to createComponent?
// transforms are a bit cryptic, maybe styles/attributes are better names? Do attributes benefit from transforms or just reserve for styles?

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
    color: 'foreground',
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
    },
  },
})

export type TextAttributeProps = AttributeProps<typeof textVariant>

export type TextStyleProps = StyleProps<typeof textVariant>

export const TextDescendantContext = createContext(false)

export const Text = styled((props) => {
  const isDescendant = useContext(TextDescendantContext)
  const { as: Element = 'span', ...variantProps } = textVariant.getProps({
    ...props,
    states: {
      descendant: isDescendant,
      ...props.states,
    },
  }).attributes

  return (
    <TextDescendantContext.Provider value={true}>
      <Element {...variantProps} />
    </TextDescendantContext.Provider>
  )
})<TextStyleProps>({ margin: 0 }, (props) => textVariant.getProps(props).styles)
