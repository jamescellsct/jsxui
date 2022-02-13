import type { ReactHTML } from 'react'
import React, { createContext, useContext } from 'react'
import styled from 'styled-components'
import type { Color, FontSize } from '../system'
import { createVariant, theme } from '../system'

export const textAttributes = createVariant({
  transforms: { as: (value: keyof ReactHTML) => value },
  states: ['descendant'],
  variants: {
    heading1: { as: 'h1' },
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
    heading1: { fontSize: 'heading1' },
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
  const { as: Element = 'span', ...props } = textAttributes.getStateProps(
    instanceProps,
    { descendant: isDescendant }
  )

  return (
    <TextDescendantContext.Provider value={true}>
      <Element {...props} />
    </TextDescendantContext.Provider>
  )
}

export const Text = styled(TextComponent)<any>({ margin: 0 }, (props) =>
  textStyles.getStyleProps(props)
)
