import type { ReactHTML } from 'react'
import React, { createContext, useContext } from 'react'
import styled from 'styled-components'
import type { Color } from '../system'
import { createVariant, theme } from '../system'

// createVariantSet
// const asProp = createVariantProp({
//   states: ['descendant'],
//   variants: {
//     heading1: 'h1',
//     body: { initial: 'p', descendant: 'span' },
//   },
// })
// asProp.getProps('heading1', { descendant: true })

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
    fontSize: (value: number) => value,
    color: (value: Color) => theme.colors[value],
  },
  defaults: {
    color: 'foreground',
    variant: 'body',
  },
  // Only variants will create global styles? Not indivual styles?
  variants: {
    heading1: { fontSize: { initial: 40, medium: 60, large: 80 } },
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

const App = () => {
  return <Text variant="heading1">Hello World</Text>
}
