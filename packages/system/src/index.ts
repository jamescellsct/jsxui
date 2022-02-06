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
        return Object.entries(transforms[propName].call(null, parsedPropValue))
      }

      // If none were available and we made it here, return media query props
      return Object.entries(propValue).map(([stateKey, value]) => [
        theme.mediaQueries[stateKey] || stateKey,
        transforms[propName].call(null, value),
      ])
    }

    return Object.entries(transforms[propName].call(null, propValue))
  }

  /**
   * Takes a props object containing style props and returns a CSS prop object.
   */
  function parseStyleProps<
    Transforms extends Record<string, Transform>,
    States extends Record<string, boolean>
  >(
    props: Record<string, unknown>,
    transforms: Transforms,
    states: States
  ): Record<string, unknown> {
    const transformKeys = Object.keys(transforms)
    const restProps: Record<string, unknown> = {}
    let styleProps = {}

    for (const prop in props) {
      const value = props[prop]
      if (transformKeys.includes(prop)) {
        styleProps = {
          ...styleProps,
          ...Object.fromEntries(
            flattenStyleProp(prop, value, transforms, states)
          ),
        }
      } else {
        restProps[prop] = value
      }
    }

    const flattenedStyles = Object.entries(styleProps).reduce(
      (styles, [key, value]) => {
        if (styles[key]) {
          //@ts-ignore
          return { ...styles, [key]: { ...styles[key], ...value } }
        }
        return { ...styles, [key]: value }
      },
      {} as any
    )

    return {
      styleProps: Object.fromEntries(
        Object.entries(flattenedStyles).sort((a, b) =>
          sortMediaQueries(a[0], b[0])
        )
      ),
      restProps,
    }
  }

  function createVariant<
    Transforms extends Record<string, Transform>,
    Props extends TransformValues<Transforms>,
    StateKeys extends string,
    VariantKeys extends string,
    Variant extends StateProps<{ as: string }, StateKeys> &
      MediaQueryAndStateProps<Partial<Props>, StateKeys>
  >({
    defaults: incomingDefaults,
    transforms,
    variants,
  }: {
    defaults?: MediaQueryAndStateProps<Partial<Props>, StateKeys> & {
      variant?: NoInfer<VariantKeys>
    }
    states?: Array<StateKeys>
    transforms: Transforms
    variants: Record<VariantKeys, Variant>
  }) {
    const { variant: defaultVariant, ...defaults } = incomingDefaults || {}

    const transformKeys = Object.keys(transforms) as Array<keyof Transforms>

    function getProps(
      variant?: VariantKeys,
      states?: Partial<Record<StateKeys, boolean>>
    ) {
      const variantProps = variants[variant || (defaultVariant as VariantKeys)]
      // TODO: add merge function that handles state props
      const props = { ...defaults, ...variantProps }
      const attributes: Record<string, unknown> = {}
      const styles: Partial<Pick<typeof props, keyof Transforms>> = {}
      const activeStateKeys = Object.entries(states || {})
        .filter(([, value]) => value)
        .map(([key]) => key)
      const lastActiveStateKey = activeStateKeys[activeStateKeys.length - 1]

      for (let name in props) {
        const value = props[name]
        if (transformKeys.includes(name)) {
          if (typeof value === 'object') {
            styles[name] = value[lastActiveStateKey || 'initial']
          } else {
            styles[name] = value
          }
        } else {
          if (typeof value === 'object') {
            attributes[name] = value[lastActiveStateKey || 'initial']
          } else {
            attributes[name] = value
          }
        }
      }

      // TODO: store/cache attributes and styles here

      return {
        attributes,
        // we return lookup ids for styles
        // this allows them to be collected at any level and matches the behavior of CSS properties
        styles: Object.fromEntries(
          Object.keys(styles).map((key) => {
            const value = props[key]
            let contextKey = null

            for (let themeKey in theme) {
              // @ts-ignore
              if (theme[themeKey][value]) {
                contextKey = themeKey
                break
              }
            }

            return [key, contextKey ? `var(--${contextKey}-${value})` : value]
          })
        ),
      }
    }

    // TODO: possibly switch back to two separate attribute/style functions?
    // This would give us a hint when and where they are called
    // Could possibly be beneficial to precalculate styles and attributes?
    return {
      variants,
      getProps,
    }
  }

  return { createVariant, theme }
}
