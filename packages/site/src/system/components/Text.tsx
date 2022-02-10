import type { ReactHTML } from 'react'
import React, { createContext, useContext } from 'react'
import styled from 'styled-components'
import type { Color } from '../system'
import { createVariant, theme } from '../system'

// Notes:
// createVariant is a weird name since you might not need variants (Stack/Grid), maybe move back to createComponent?
// transforms are a bit cryptic, maybe styles/attributes are better names? Do attributes benefit from transforms or just reserve for styles?

export const textAttribute = createVariant({
  transforms: { as: (value: keyof ReactHTML) => value },
  states: ['descendant'],
  variants: {
    heading1: { as: 'h1' },
    body: { as: { initial: 'p', descendant: 'span' } },
  },
})

export const textStyle = createVariant({
  transforms: {
    fontSize: (value: number) => value,
    color: (value: Color) => theme.colors[value],
  },
  defaults: {
    color: 'foreground',
    variant: 'body',
  },
  variants: {
    heading1: { fontSize: { initial: 40, medium: 60, large: 80 } },
    body: { fontSize: 24 },
  },
})

export type TextStyleProps = typeof textStyle.variants

export const TextDescendantContext = createContext(false)

export const Text = styled((props) => {
  const isDescendant = useContext(TextDescendantContext)
  const { as: Element = 'span', ...variantProps } = textAttribute.getStateProps(
    props,
    { descendant: isDescendant }
  )

  return (
    <TextDescendantContext.Provider value={true}>
      <Element {...variantProps} />
    </TextDescendantContext.Provider>
  )
})<TextStyleProps>({ margin: 0 }, (props) => textStyle.getStyleProps(props))
