import type {
  NoInfer,
  Transform,
  TransformValues,
  TransformValue,
  ComplexProps,
  ComplexValue,
} from './types'

export function createSystem<
  Theme extends Record<'mediaQueries' | string, unknown>
>(theme: Theme) {
  type MediaQueryAndStateProps<Props, StateKeys extends string> = ComplexProps<
    Props,
    keyof Theme['mediaQueries'] | StateKeys
  >

  const allVariants = new Map<
    Parameters<typeof createVariant>[0],
    ReturnType<typeof createVariant>
  >()

  function collectStyles() {
    return {}
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
    const transformKeys = Object.keys(transforms) as Array<keyof Transforms>

    function getProps(
      variant?: VariantKeys,
      states?: Partial<Record<StateKeys, boolean>>
    ) {
      const variantProps = variants[variant || (defaultVariant as VariantKeys)]
      // TODO: add merge function that handles media query and state props
      const props = { ...defaults, ...variantProps }
      const attributes: Record<string, unknown> = {}
      const styles: Partial<Pick<typeof props, keyof Transforms>> = {}
      const activeStateKeys = Object.entries(states || {})
        .filter(([, value]) => value)
        .map(([key]) => key)
      const lastActiveStateKey = activeStateKeys[activeStateKeys.length - 1]

      for (let name in props) {
        const value = props[name]
        const parsedeValue =
          typeof value === 'object'
            ? value[lastActiveStateKey || 'initial']
            : value
        if (transformKeys.includes(name)) {
          styles[name] = parsedeValue
        } else {
          attributes[name] = parsedeValue
        }
      }

      const aliasedStyles = Object.fromEntries(
        Object.entries(styles).map(([key, parsedValue]) => {
          const value = props[key]
          let context = null

          for (let themeKey in theme) {
            // @ts-ignore
            if (theme[themeKey][value]) {
              context = themeKey
              break
            }
          }

          return [key, context ? `var(--${context}-${value})` : parsedValue]
        })
      )

      return {
        attributes,
        styles: aliasedStyles,
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

export type {
  Transform,
  TransformValues,
  TransformValue,
  ComplexProps,
  ComplexValue,
}
