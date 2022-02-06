import createSort from 'sort-css-media-queries/lib/create-sort'

// TODO: look into supporting level 4 syntax and sorting
// https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#syntax_improvements_in_level_4
const sortMediaQueries = createSort()

type NoInfer<T> = T extends infer S ? S : never

type Transform = (value: any) => Record<string, unknown>

type TransformValue<Transform extends (value: any) => Record<string, unknown>> =
  Parameters<Transform>[0]

type TransformValues<T extends Record<string, Transform>> = {
  [K in keyof T]: TransformValue<T[K]>
}

export function createSystem<
  Theme extends Record<'mediaQueries' | string, unknown>
>(theme: Theme) {
  type MediaQueryAndStateValue<T, S extends string> =
    | T
    | ({ initial?: T } & { [K in keyof Theme['mediaQueries']]?: T } &
        {
          [K in S]?: T
        })

  type MediaQueryAndStateProps<T, S extends string> = {
    [K in keyof T]: MediaQueryAndStateValue<T[K], S>
  }

  type StateValue<T, S extends string> =
    | T
    | ({ initial?: T } & { [K in S]?: T })

  type StateProps<T, S extends string> = {
    [K in keyof T]: StateValue<T[K], S>
  }

  function getStylePropValue(name, value, transforms) {
    return transforms[name] ? transforms[name].call(null, value) : value
  }

  /**
   * Takes a media query / state prop value and returns a flattened CSS prop object.
   */
  function flattenStyleProp<
    Transforms extends Record<string, Transform>,
    States extends Record<string, boolean>
  >(
    propName: string,
    propValue: unknown,
    transforms: Transforms,
    states: States
  ) {
    if (typeof propValue === 'object') {
      let parsedPropValue = null

      // First, check for state prop values
      Object.entries(propValue).forEach(([stateKey, value]) => {
        if (stateKey === 'initial' || states[stateKey]) {
          parsedPropValue = value
        }
      })

      if (parsedPropValue) {
        return Object.entries(
          getStylePropValue(propName, propValue, transforms)
        )
      }

      // If none were available and we made it here, return media query props
      return Object.entries(propValue).map(([stateKey, value]) => [
        theme.mediaQueries[stateKey] || stateKey,
        getStylePropValue(propName, value, transforms),
      ])
    }

    return Object.entries(getStylePropValue(propName, propValue, transforms))
  }

  /**
   * Takes a props object containing style props and returns a CSS prop object.
   */
  function parseStyleProps<
    Transforms extends Record<string, Transform>,
    States extends Record<string, boolean>
  >(props: Record<string, unknown>, transforms: Transforms, states: States) {
    let styleProps = {}

    for (const prop in props) {
      const value = props[prop]
      styleProps = {
        ...styleProps,
        ...Object.fromEntries(
          flattenStyleProp(prop, value, transforms, states)
        ),
      }
    }

    const flattenedMediaStyles = Object.entries(styleProps).reduce(
      (styles, [key, value]) => {
        if (styles[key]) {
          //@ts-ignore
          return { ...styles, [key]: { ...styles[key], ...value } }
        }
        return { ...styles, [key]: value }
      },
      {}
    )

    return Object.fromEntries(
      Object.entries(flattenedMediaStyles).sort((a, b) =>
        sortMediaQueries(a[0], b[0])
      )
    )
  }

  const allVariants = new Map<
    Parameters<typeof createVariant>[0],
    ReturnType<typeof createVariant>
  >()

  function collectStyles() {
    return null
  }

  function createVariant<
    Transforms extends Record<string, Transform>,
    Props extends TransformValues<Transforms>,
    StateKeys extends string,
    VariantKeys extends string,
    Variant extends StateProps<{ as: string }, StateKeys> &
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
