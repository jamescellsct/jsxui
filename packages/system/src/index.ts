import type {
  ComplexProps,
  ComplexValue,
  MediaQueries,
  NoInfer,
  Transform,
  TransformValues,
  TransformValue,
} from './types'
import { flattenProp } from './flatten-prop'

export function createSystem<
  Theme extends Record<string, unknown> & Record<'mediaQueries', MediaQueries>
>(theme: Theme) {
  type MediaQueryAndStateProps<Props, StateKeys extends string> = ComplexProps<
    Props,
    keyof Theme['mediaQueries'] | StateKeys
  >
  /** Searches theme to determine if value is an aliased token. */
  const getThemeContext = (value) => {
    let aliasContext = null

    Object.entries(theme).forEach(([context, tokens]) => {
      if (Object.keys(tokens).some((token) => token === value)) {
        aliasContext = context
      }
    })

    return aliasContext
  }

  const { mediaQueries, ...tokenSets } = theme
  const allVariants = new Map()

  function collectStyles() {
    const styles = Object.fromEntries(
      ['initial']
        .concat(Object.keys(mediaQueries))
        .map((queryName) => [queryName, {}])
    )

    Object.entries(tokenSets).forEach(([tokenSetKey, tokens]) => {
      Object.entries(tokens).forEach(([tokenKey, value]) => {
        if (typeof value === 'object') {
          Object.entries(value).forEach(([stateKey, value]) => {
            styles[stateKey][`--${tokenSetKey}-${tokenKey}`] = value
          })
        } else {
          styles.initial[`--${tokenSetKey}-${tokenKey}`] = value
        }
      })
    })

    return Object.fromEntries(
      Object.entries(styles)
        .filter(([, styles]) => Object.keys(styles).length)
        .map(([queryName, styles]) => [
          queryName === 'initial'
            ? ':root'
            : `@media ${mediaQueries[queryName]}`,
          queryName === 'initial' ? styles : { ':root': styles },
        ])
    )
  }

  function createVariant<
    Transforms extends Record<string, Transform>,
    Props extends TransformValues<Transforms>,
    StateKeys extends string,
    VariantKeys extends string,
    Variant extends ComplexProps<{ as: string }, StateKeys> &
      MediaQueryAndStateProps<Partial<Props>, StateKeys>
  >(config: {
    defaults?: MediaQueryAndStateProps<Partial<Props>, StateKeys> & {
      variant?: NoInfer<VariantKeys>
    }
    states?: Array<StateKeys>
    transforms: Transforms
    variants: Record<VariantKeys, Variant>
  }) {
    const { defaults: incomingDefaults, transforms, variants } = config
    const { variant: defaultVariant, ...defaults } = incomingDefaults || {}

    function getProps(
      variant?: VariantKeys,
      states?: Partial<Record<StateKeys, boolean>>
    ) {
      const variantProps = variants[variant || (defaultVariant as VariantKeys)]
      // TODO: add merge function that handles media query and state props
      const props = { ...defaults, ...variantProps }

      const transformKeys = Object.keys(transforms) as Array<keyof Transforms>
      const activeStateKeys = Object.entries(states || {})
        .filter(([, value]) => value)
        .map(([key]) => key)
      const lastActiveStateKey =
        activeStateKeys[activeStateKeys.length - 1] ?? 'initial'
      const attributes: Record<string, unknown> = {}
      const styles: Record<string, unknown> = {}
      // const styles: Partial<Record<keyof Props, any>> = {}
      // const attributes: Record<string, unknown> = {}
      // const styles: Partial<Pick<typeof props, keyof Transforms>> = {}

      // TODO: can we support CSS states through transforms?
      // If returning states they are always applied or the user can control this somehow?
      // (value: string) => ({ initial: ({ color: value }), hover: ({ '&:hover': { color: value } })
      for (const name in props) {
        const value = props[name]

        if (transformKeys.includes(name)) {
          const context = getThemeContext(value)

          styles[name] = context ? `var(--${context}-${value})` : value
        } else {
          let parsedValue = value

          if (typeof value === 'object') {
            if (lastActiveStateKey) {
              parsedValue = value[lastActiveStateKey]
            }
          }

          // TODO: How to handle media query props, event emitter on query change?
          attributes[name] = parsedValue
        }
      }

      return {
        attributes,
        styles,
      }
    }

    // Store variant for access in collectStyles
    allVariants.set(config, {
      variants,
      getProps,
    })

    return {
      variants,
      getProps,
    }
  }

  return { collectStyles, createVariant, theme }
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
