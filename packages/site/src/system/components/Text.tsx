import type { ReactHTML } from 'react'
import React, { createContext, useContext } from 'react'
import styled from 'styled-components'
import type { Color, FontSize } from '../system'
import { createVariant, theme } from '../system'

export const textAttributes = createVariant({
  transforms: { as: (value: keyof ReactHTML) => value },
  states: ['descendant'],
  defaults: { variant: 'body' },
  variants: {
    heading1: { as: 'h1' },
    heading2: { as: 'h2' },
    body: { as: { initial: 'p', descendant: 'span' } },
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
  },
})

export type TextProps = {
  as?: keyof typeof textAttributes.variants
  variant?: keyof typeof textStyles.variants
}

export const TextDescendantContext = createContext(false)

function TextComponent(instanceProps: TextProps) {
  const isDescendant = useContext(TextDescendantContext)
  const { as: Element, ...props } = textAttributes.getStateProps(
    instanceProps,
    { descendant: isDescendant }
  )

  return (
    <TextDescendantContext.Provider value={true}>
      <Element {...props} />
    </TextDescendantContext.Provider>
  )
}

export const Text = styled(TextComponent)({ margin: 0 }, (props) =>
  textStyles.getStyleProps(props)
)
