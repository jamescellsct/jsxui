import createSort from 'sort-css-media-queries/lib/create-sort'
import { flattenStyleProp } from './flatten-prop'

// TODO: look into supporting level 4 syntax and sorting
// https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#syntax_improvements_in_level_4
const sortMediaQueries = createSort()

type Transform = (value: any) => Record<string, unknown>

/**
 * Takes a props object containing style props and returns a CSS prop object.
 */
export function parseProps<
  Transforms extends Record<string, Transform>,
  States extends Record<string, boolean>,
  Theme extends Record<'mediaQueries' | string, unknown>
>(
  props: Record<string, unknown>,
  transforms: Transforms,
  states: States,
  theme: Theme
) {
  let styleProps = {}

  for (const prop in props) {
    const value = props[prop]
    styleProps = {
      ...styleProps,
      ...Object.fromEntries(flattenStyleProp(prop, value, transforms, states)),
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
