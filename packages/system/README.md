# @jsxui/system

Utilities to configure your Design System for any framework or platform.

## Install

```bash
yarn add @jsxui/system
npm install @jsxui/system
```

## Get Started

This package ships with a helper function to create a design system configuration that returns context aware utilities.

After installing, import the helper function and create your design system configuration:

```ts
import { createSystem } from '@jsxui/system'

export const { createVariant, collectVariants, theme } = createSystem({
  mediaQueries: {
    small: '@media (min-width: 0px)',
    medium: '@media (min-width: 960px)',
    large: '@media (min-width: 1280px)',
    dark: '@media (prefers-color-scheme: dark)',
  },
  colors: {
    primary: { initial: '#0070f3', dark: '#0693d2' },
    secondary: { initial: '#ff4081', dark: '#c60055' },
    background: { initial: '#fafafa', dark: '#212121' },
    foreground: { initial: '#212121', dark: '#fafafa' },
  },
})

export type ColorValue = keyof typeof theme.colors
```

Now we can use the helper function to create our first variant which will be used for text in our design system:

```ts
import { createVariant, ColorValue, theme } from 'system'

const textVariant = createVariant({
  transforms: {
    fontSize: (size: number) => size,
    color: (color: ColorValue) => ({ color: theme.colors[color] }),
  },
})
```

Notice that we start by defining [transforms]. These are functions that will be applied to the variant's props and can return either a single value or an object of multiple values.

Now we can start to define variants as well as defaults:

```ts
import { createVariant, ColorValue } from 'system'

const textVariant = createVariant({
  transforms: {
    color: (color: ColorValue) => ({ color: theme.colors[color] }),
  },
  defaults: {
    color: 'foreground',
  },
  variants: {
    heading1: {
      as: 'h1',
      fontSize: { initial: '2rem', medium: '3rem', large: '4rem' },
    },
    heading2: {
      as: 'h2',
      fontSize: { initial: '1.5rem', medium: '2rem', large: '3rem' },
    },
    body: {
      as: 'p',
      fontSize: { initial: '1rem', medium: '1.25rem', large: '1.5rem' },
    },
  },
})
```

Now we can use our text variant with whatever library we want. Let's see how we can use it with Styled Components:

```tsx
import type { StyleProps } from '@jsxui/system'
import styled from 'styled-components'
import { textVariant } from 'system'

export type TextAttributeProps = StyleProps<typeof textVariant>

export type TextStyleProps = StyleProps<typeof textVariant>

export const Text = styled.p.attrs<TextAttributeProps>(
  (props) => textVariant.getProps(props.variant, props.states).attributes
)<TextStyleProps>(
  (props) => textVariant.getProps(props.variant, props.states).styles
)
```

Now we can use our `Text` component in our application with fully typed variants and states:

```tsx
import { Text } from 'system'

function App() {
  return (
    <Text variant="heading1" color="primary">
      Hello World
    </Text>
  )
}
```

### Theming

Most applications need to be able to change the theme of their design system. This is where the `theme` object comes in.

Taking our previous example, we can create a theme object that can be used to change the colors of our text. We'll start by creating a `Theme` component:

```tsx
import { ThemeKey } from '@jsxui/system'
import { collectVariants, theme } from 'system'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

const GlobalStyles = createGlobalStyle(collectVariants)

const ThemeContext = React.createContext<ThemeKey<typeof theme>>(null)

export function AppProvider({ theme }: { theme: ThemeKey<typeof theme> }) {
  return (
    <>
      <GlobalStyles />
      <Theme value={theme}>
        <App />
      </Theme>
    </>
  )
}
```

Using the `AppProvider` component we can now provide the proper CSS properties that can be used by leaf components.

```tsx
import { AppProvider } from 'system'

export function App({ children }) {
  return <AppProvider>{children}</AppProvider>
}
```

To set a specific theme for a tree of components, use the `ThemeProvider` component:

```tsx
import { AppProvider, ThemeProvider } from 'system'

export function App() {
  return (
    <AppProvider>
      <Text>Hello World</Text>
      {/* Force theme to always be dark regardless of user preference */}
      <Theme variant="dark">
        <Text>Hello World</Text>
      </Theme>
    </AppProvider>
  )
}
```

### States

Variants can affect more than just the CSS properties. For example, a variant can affect the element type of a component. In our variant above we specified that the `body` variant should be rendered as an `p` element. What if we wanted to nest our `Text` component though? This would render inaccessible markup as we're nesting two block-level elements in one another.

To fix this, we can use the `states` object to specify which states a prop value can define. This allows us to swap out the element while in a specific state:

```tsx
import { createContext } from 'react'
import type { AttributeProps, StyleProps } from '@jsxui/system'
import styled from 'styled-components'
import { textVariant } from 'system'

export type TextAttributeProps = AttributeProps<typeof textVariant>

export type TextStyleProps = StyleProps<typeof textVariant>

export const TextDescendantContext = createContext(false)

export const Text = styled<TextAttributeProps>((props) => {
  const isDescendant = React.useContext(TextDescendantContext)
  const { as: Element, ...props } = textVariant.getProps(props.variant, {
    descendant: isDescendant,
    ...props.states,
  }).attributes

  return (
    <TextDescendantContext.Provider value={true}>
      <Element {...props} />
    </TextDescendantContext.Provider>
  )
})<TextStyleProps>(
  (props) => textVariant.getProps(props.variant, props.states).styles
)
```

Now this will allow us to render a `span` when the `Text` component is a descendant of itself giving us proper semantic markup.

### Overriding

Each variant can be overriden.

```ts
import { textVariant } from 'system'

textVariant.override('heading1', {
  fontSize: { initial: '2rem', medium: '3rem', large: '4rem' },
})
```

This is helpful inside of a component system if we want to be able to override the defaults for a tree:

## Guides

### Button

```tsx
import type { AttributeProps, StyleProps } from '@jsxui/system'
import type { BoxSizeValue, ColorValue, ContainerSizeValue } from 'system'
import { createVariant, mergeVariants, theme } from 'system'
import styled from 'styled-components'

const colorTransform = (color: ColorValue) => theme.colors[color]

const buttonVariant = createVariant({
  name: 'variant',
  states: ['disabled', 'pressed', 'focused'],
  transforms: {
    backgroundColor: colorTransform,
    color: colorTransform,
    borderColor: colorTransform,
    borderSize: (size: number) => size,
    opacity: (opacity: number) => opacity,
  },
  defaults: {
    opacity: { disabled: 0.65 },
    variant: 'primary',
  },
  variants: {
    primary: {
      color: 'foreground',
      backgroundColor: 'interactiveBackgroundPrimary',
    },
    primaryOutline: {
      color: 'interactiveForegroundPrimary',
      borderColor: 'interactiveBorderPrimary',
      borderSize: 1,
    },
    secondary: {
      color: 'foreground',
      color: 'interactiveBackgroundSecondary',
    },
    secondaryOutline: {
      color: 'interactiveForegroundSecondary',
      borderColor: 'interactiveBorderSecondary',
      borderSize: 1,
    },
  },
})

const sizeVariant = createVariant({
  name: 'size',
  transforms: {
    fontSize: (size: string) => size,
    minHeight: (size: number) => theme.boxSizes[size] || size,
    spaceAround: (size: number) => {
      const value = theme.boxSpacings[size] || size
      return {
        paddingLeft: value,
        paddingRight: value,
      }
    },
  },
  variants: {
    small: {
      fontSize: '16px',
      minHeight: '20px',
      spaceAround: '4px',
    },
    medium: {
      fontSize: '20px',
      minHeight: '24px',
      spaceAround: '8px',
    },
    large: {
      fontSize: '24px',
      minHeight: '32px',
      spaceAround: '16px',
    },
  },
})

const variants = mergeVariants(buttonVariant, sizeVariant)

export const Button = styled.button<StyleProps<typeof variants>>(
  (props) => variants.getProps(props.variant, props.states).styles
)

// Example
function App() {
  return (
    <Button
      size={{
        initial: 'small',
        medium: 'large',
      }}
      variant="primary"
    />
  )
}
```
