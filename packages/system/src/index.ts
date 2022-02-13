import { kebabCase } from 'case-anything'
import type {
  ComplexProps,
  ComplexValue,
  MediaQueries,
  NoInfer,
  Transform,
  TransformValues,
  TransformValue,
} from './types'

export function createSystem<
  Theme extends Record<string, unknown> & Record<'mediaQueries', MediaQueries>
>(theme: Theme) {
  const { mediaQueries, ...tokenSets } = theme
  const contextStyles = Object.fromEntries(
    ['initial']
      .concat(Object.keys(mediaQueries))
      .map((queryName) => [queryName, {}])
  )

  /** Search theme to determine if value is an aliased token. */
  function getThemeContext(value) {
    let aliasContext = null

    Object.entries(theme).forEach(([context, tokens]) => {
      if (Object.keys(tokens).some((token) => token === value)) {
        aliasContext = context
      }
    })

    return aliasContext
  }

  function collectStyles() {
    // Collect media query styles
    Object.entries(tokenSets).forEach(([tokenSetKey, tokens]) => {
      Object.entries(tokens).forEach(([tokenKey, value]) => {
        const propertyName = createToken(tokenSetKey, tokenKey)
        if (typeof value === 'object') {
          Object.entries(value).forEach(([stateKey, value]) => {
            contextStyles[stateKey][propertyName] = value
          })
        } else {
          contextStyles.initial[propertyName] = value
        }
      })
    })

    // Create CSS styles
    const globalStyles = Object.fromEntries(
      Object.entries(contextStyles).map(([queryName, styles]) =>
        queryName === 'initial'
          ? [':root', styles]
          : [`@media ${mediaQueries[queryName]}`, { ':root': styles }]
      )
    )

    return globalStyles
  }

  function createVariant<
    Transforms extends Record<string, Transform>,
    StateKeys extends string,
    VariantKeys extends string
  >(config: {
    name?: string
    transforms: Transforms
    states?: Array<StateKeys>
    defaults?: Partial<TransformValues<Transforms>> & {
      variant?: NoInfer<VariantKeys>
    }
    variants: Record<
      VariantKeys,
      ComplexProps<
        Partial<TransformValues<Transforms>>,
        keyof Theme['mediaQueries'] | StateKeys
      >
    >
  }) {
    type TransformedProps = Partial<{ [K in keyof Transforms]: any }>

    const { name = '', defaults, transforms, variants } = config
    const { variant: defaultVariant, ...defaultProps } = defaults || {}
    const transformKeys = Object.keys(transforms) as Array<keyof Transforms>

    function getStateProps(
      {
        variant,
        states: instanceStates,
        ...instanceProps
      }: Record<string, unknown> & {
        states?: Partial<Record<StateKeys, boolean>>
        variant?: VariantKeys
      } = {},
      localStates?: Partial<Record<StateKeys, boolean>>
    ) {
      const variantProps = variants[variant || (defaultVariant as VariantKeys)]
      const props = { ...defaultProps, ...variantProps, ...instanceProps }
      const states = { ...localStates, ...instanceStates }

      return Object.fromEntries(
        Object.entries(props).map(([key, value]) => {
          let parsedValue = value

          if (
            typeof value === 'object' &&
            Object.keys(value).some(
              (stateKey) => stateKey in transforms || stateKey in states
            )
          ) {
            parsedValue = value['initial']

            Object.entries(states).forEach(([stateKey, active]) => {
              if (active) {
                const stateValue = value[stateKey]

                if (stateValue) {
                  parsedValue = stateValue
                }
              }
            })
          }

          return [key, parsedValue]
        })
      )
    }

    function getStyleProps({
      variant,
      ...instanceProps
    }: Record<string, unknown> & {
      variant?: VariantKeys
    } = {}) {
      const variantProps = variants[variant || (defaultVariant as VariantKeys)]
      // TODO: add merge function that handles media query and state props
      const props = { ...defaultProps, ...variantProps, ...instanceProps }
      let styleProps: TransformedProps = {}

      transformKeys.forEach((key) => {
        const value = props[key]
        const transform = transforms[key]
        let parsedValue

        if (typeof value === 'object') {
          parsedValue = {}

          for (const stateKey in value) {
            const stateValue = value[stateKey]
            const transformedValue = transform(stateValue)

            if (stateKey === 'initial') {
              if (typeof transformedValue === 'object') {
                parsedValue = { ...parsedValue, ...transformedValue }
              } else {
                parsedValue = { ...parsedValue, [key]: transformedValue }
              }
            } else {
              parsedValue[`@media ${mediaQueries[stateKey]}`] =
                typeof transformedValue === 'object'
                  ? {
                      ...parsedValue,
                      ...transformedValue,
                    }
                  : {
                      ...parsedValue,
                      [key]: transformedValue,
                    }
            }
          }
        } else {
          const transformedValue = transform(value)

          if (typeof transformedValue === 'object') {
            parsedValue = transformedValue
          } else {
            parsedValue = {
              [key]: transformedValue,
            }
          }
        }

        styleProps = {
          ...styleProps,
          ...parsedValue,
        }
      })

      return styleProps
    }

    return {
      getStateProps,
      getStyleProps,
      variants,
    }
  }

  const parsedTheme = Object.fromEntries(
    Object.entries(theme).map(([context, tokens]) =>
      context === 'mediaQueries'
        ? [context, tokens]
        : [
            context,
            Object.fromEntries(
              Object.keys(tokens).map((token) => [
                token,
                accessToken(context, token),
              ])
            ),
          ]
    )
  )

  return {
    collectStyles,
    createVariant,
    theme: parsedTheme,
  }
}

/** Create a style token. */
export function createToken(...path: string[]) {
  return `--${kebabCase(path.join('-'))}`
}

/** Access a style token. */
export function accessToken(...path: string[]) {
  return `var(--${kebabCase(path.join('-'))})`
}

export type CreateVariantReturnType = ReturnType<
  ReturnType<typeof createSystem>['createVariant']
>

export type {
  Transform,
  TransformValues,
  TransformValue,
  ComplexProps,
  ComplexValue,
}
