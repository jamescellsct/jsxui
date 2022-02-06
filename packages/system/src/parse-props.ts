import createSort from 'sort-css-media-queries/lib/create-sort'
import { flattenProp } from './flatten-prop'
import type { Transform } from './types'

// TODO: look into supporting level 4 syntax and sorting
// https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#syntax_improvements_in_level_4
const sortMediaQueries = createSort()

/**
 * Takes a props object containing media and state props and returns a CSS prop object.
 */
export function parseProps<
  //splitProps
  Props extends Record<string, unknown>,
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
  const activeStateKeys = Object.entries(states || {})
    .filter(([, value]) => value)
    .map(([key]) => key)
  const lastActiveStateKey = activeStateKeys[activeStateKeys.length - 1]
  const attributes: Record<string, unknown> = {}
  const styles: Partial<Pick<typeof props, keyof Transforms>> = {}
  const parsedProps: Partial<Props> = {}

  for (const prop in props) {
    const value = props[prop]

    if (typeof value === 'object') {
      // parsedProps[prop] = value
    } else {
      const transformedValue = transforms[prop].call(null, value)
      parsedProps[prop] = transformedValue
    }
    //   parsedProps = {
    //     ...parsedProps,
    //     ...Object.fromEntries(
    //       flattenStyleProp(prop, value, transforms, states, theme)
    //     ),
    //   }
  }

  return parsedProps

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
}
