import type { Transform } from './types'

/**
 * Flatten complex prop values (initial / media query / state).
 */
export function flattenProp<
  Transforms extends Record<string, Transform>,
  States extends Record<string, boolean>
>({
  name,
  value,
  transforms,
  states,
  mediaQueries,
}: {
  name: string
  value: unknown
  transforms: Transforms
  states: States
  mediaQueries: Record<string, unknown>
}) {
  if (typeof value === 'object') {
    let parsedPropValue = null

    // First, check for state prop values
    Object.entries(value).forEach(([stateKey, value]) => {
      if (stateKey === 'initial' || states[stateKey]) {
        parsedPropValue = value
      }
    })

    if (parsedPropValue) {
      return getStylePropValue(name, value, transforms)
    }

    // If none were available and we made it here, return media query props
    return Object.fromEntries(
      Object.entries(value).map(([stateKey, value]) => [
        mediaQueries[stateKey] || stateKey,
        getStylePropValue(name, value, transforms),
      ])
    )
  }

  return getStylePropValue(name, value, transforms)
}

function getStylePropValue<Transforms extends Record<string, Transform>>(
  name: string,
  value: unknown,
  transforms: Transforms
) {
  return transforms[name] ? transforms[name].call(null, value) : value
}
