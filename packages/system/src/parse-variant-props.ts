import createSort from 'sort-css-media-queries/lib/create-sort'
import { flattenProp } from './flatten-prop'
import type { Transform, TransformValues } from './types'

// TODO: look into supporting level 4 syntax and sorting
// https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#syntax_improvements_in_level_4
const sortMediaQueries = createSort()

/**
 * Takes a props object containing media and state props and returns a CSS prop object.
 */
export function parseVariantProps<
  Props extends Transform,
  Transforms extends Record<string, Transform>,
  States extends Record<string, boolean>,
  Theme extends Record<'mediaQueries' | string, unknown>
>({
  props,
  transforms,
  states,
  theme,
}: {
  props: Props
  transforms: Transforms
  states: States
  theme: Theme
}) {
  // const transformKeys = Object.keys(transforms) as Array<keyof Transforms>
  const activeStateKeys = Object.entries(states || {})
    .filter(([, value]) => value)
    .map(([key]) => key)
  const lastActiveStateKey = activeStateKeys[activeStateKeys.length - 1]
  const attributes: Record<string, unknown> = {}
  const styles: Partial<Pick<Props, keyof Transforms>> = {}
  // const styles: Partial<Record<keyof Props, any>> = {}
  // const attributes: Record<string, unknown> = {}
  // const styles: Partial<Pick<typeof props, keyof Transforms>> = {}

  for (const prop in props) {
    const value = props[prop]

    if (typeof value === 'object') {
      // parsedProps[prop] = value
    } else {
      const transformedValue = transforms[prop].call(null, value)
      styles[prop] = transformedValue
    }
    //   parsedProps = {
    //     ...parsedProps,
    //     ...Object.fromEntries(
    //       flattenStyleProp(prop, value, transforms, states, theme)
    //     ),
    //   }
  }

  return {
    attributes,
    styles,
  }

  // const flattenedMediaStyles = Object.entries(parsedProps).reduce(
  //   (styles, [key, value]) => {
  //     if (styles[key]) {
  //       //@ts-ignore
  //       return { ...styles, [key]: { ...styles[key], ...value } }
  //     }
  //     return { ...styles, [key]: value }
  //   },
  //   {}
  // )

  // return Object.fromEntries(
  //   Object.entries(flattenedMediaStyles).sort((a, b) =>
  //     sortMediaQueries(a[0], b[0])
  //   )
  // )

  //   const attributes: Record<string, unknown> = {}
  //   const styles: Partial<Pick<typeof props, keyof Transforms>> = {}
  //   const activeStateKeys = Object.entries(states || {})
  //     .filter(([, value]) => value)
  //     .map(([key]) => key)
  //   const lastActiveStateKey = activeStateKeys[activeStateKeys.length - 1]

  //   for (let name in props) {
  //     const value = props[name]
  //     const parsedeValue =
  //       typeof value === 'object'
  //         ? value[lastActiveStateKey || 'initial']
  //         : value
  //     if (transformKeys.includes(name)) {
  //       styles[name] = parsedeValue
  //     } else {
  //       attributes[name] = parsedeValue
  //     }
  //   }

  //   const aliasedStyles = Object.fromEntries(
  //     Object.entries(styles).map(([key, parsedValue]) => {
  //       const value = props[key]
  //       let context = null

  //       for (let themeKey in theme) {
  //         // @ts-ignore
  //         if (theme[themeKey][value]) {
  //           context = themeKey
  //           break
  //         }
  //       }

  //       return [key, context ? `var(--${context}-${value})` : parsedValue]
  //     })
  //   )

  //   return {
  //     attributes,
  //     styles: aliasedStyles,
  //   }
}
