import { createContext, useContext } from 'react'
import type { AttributeProps, StyleProps } from '@jsxui/system'
import styled from 'styled-components'
import type { Color } from '../system'
import { createVariant, collectStyles, theme } from '../system'

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

export type TextAttributeProps = AttributeProps<typeof textVariant>

export type TextStyleProps = StyleProps<typeof textVariant>

export const TextDescendantContext = createContext(false)

export const Text = styled((props) => {
  const isDescendant = useContext(TextDescendantContext)
  const { as: Element = 'span', ...variantProps } = textVariant.getProps(
    props.variant,
    {
      descendant: isDescendant,
      ...props.states,
    }
  ).attributes

  return (
    <TextDescendantContext.Provider value={true}>
      <Element {...variantProps} {...props} />
    </TextDescendantContext.Provider>
  )
})<TextStyleProps>(
  (props) => textVariant.getProps(props.variant, props.states).styles
)
