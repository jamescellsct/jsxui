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
  type MediaQueryAndStateProps<Props, StateKeys extends string> = ComplexProps<
    Props,
    keyof Theme['mediaQueries'] | StateKeys
  >
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
    Props extends TransformValues<Transforms>,
    StateKeys extends string,
    VariantKeys extends string,
    Variant extends ComplexProps<{ as: string }, StateKeys> &
      MediaQueryAndStateProps<Partial<Props>, StateKeys>
  >(config: {
    transforms: Transforms
    states?: Array<StateKeys>
    defaults?: MediaQueryAndStateProps<Partial<Props>, StateKeys> & {
      variant?: NoInfer<VariantKeys>
    }
    variants?: Record<VariantKeys, Variant>
  }) {
    const { defaults, transforms, variants } = config
    const { variant: defaultVariant, ...defaultProps } = defaults || {}

    function getProps(
      {
        variant,
        ...instanceProps
      }: Record<string, unknown> & {
        variant?: VariantKeys
      } = {},
      states?: Partial<Record<StateKeys, boolean>>
    ) {
      const variantProps = variants[variant || (defaultVariant as VariantKeys)]
      // TODO: add merge function that handles media query and state props
      const props = { ...defaultProps, ...variantProps, ...instanceProps }
      const transformKeys = Object.keys(transforms) as Array<keyof Transforms>
      const attributes: Record<string, unknown> = {}
      const styles: Record<string, unknown> = {}

      // TODO: can we support CSS states through transforms?
      // If returning states they are always applied or the user can control this somehow?
      // (value: string) => ({ initial: ({ color: value }), hover: ({ '&:hover': { color: value } })
      for (const name in props) {
        const value = props[name]

        if (transformKeys.includes(name)) {
          const context = getThemeContext(value)
          let parsedValue

          if (context && typeof value === 'string') {
            parsedValue = accessToken(context, value)
          } else if (typeof value === 'object') {
            const token = createToken(name, variant)

            // TODO: add support for states
            Object.entries(value).forEach(([stateKey, value]) => {
              contextStyles[stateKey][token] = value
            })

            parsedValue = accessToken(name, variant)
          } else {
            parsedValue = value
          }

          styles[name] = parsedValue
        } else {
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

          // TODO: How to handle media query attribute props, event emitter on query change?
          attributes[name] = parsedValue
        }
      }

      return {
        attributes,
        styles,
      }
    }

    return {
      variants,
      getProps,
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

export type VariantProps<T extends CreateVariantReturnType> = ReturnType<
  T['getProps']
>

export type StyleProps<T extends CreateVariantReturnType> =
  VariantProps<T>['styles'] & {
    variant?: keyof T['variants']
  }

export type AttributeProps<T extends CreateVariantReturnType> =
  VariantProps<T>['attributes'] & {
    variant?: keyof T['variants']
  }

export type {
  Transform,
  TransformValues,
  TransformValue,
  ComplexProps,
  ComplexValue,
}
