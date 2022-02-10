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
    transforms: Transforms
    states?: Array<StateKeys>
    defaults?: Partial<TransformValues<Transforms>> & {
      variant?: NoInfer<VariantKeys>
    }
    variants?: Record<
      VariantKeys,
      ComplexProps<
        Partial<TransformValues<Transforms>>,
        keyof Theme['mediaQueries'] | StateKeys
      >
    >
  }) {
    const { defaults, transforms, variants } = config
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

      for (const name in props) {
        const value = props[name]
        let parsedValue = value

        if (typeof value === 'object') {
          parsedValue = value['initial']

          Object.entries(states || {}).forEach(([stateKey, active]) => {
            if (active) {
              const stateValue = value[stateKey]
              if (stateValue) {
                parsedValue = stateValue
              }
            }
          })
        }

        props[name] = parsedValue
      }

      return props
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

      transformKeys.forEach((key) => {
        const value = props[key]
        const context = getThemeContext(value)
        let parsedValue

        if (context && typeof value === 'string') {
          parsedValue = accessToken(context, value)
        } else if (typeof value === 'object') {
          const token = createToken(key as string, variant)

          Object.entries(value).forEach(([stateKey, value]) => {
            contextStyles[stateKey][token] = value
          })

          parsedValue = accessToken(key as string, variant)
        } else {
          parsedValue = value
        }

        props[key] = parsedValue
      })

      return props
    }

    return {
      getStateProps,
      getStyleProps,
      variants,
    }
  }

  return { collectStyles, createVariant, theme }
}

/** Create a Design System token. */
export function createToken(...path: string[]) {
  return `--${kebabCase(path.join('-'))}`
}

/** Access a Design System token. */
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
