import type { Transform } from './types'

/**
 * Takes a media query / state prop value and returns a flattened CSS prop object.
 */
export function flattenStyleProp<
  Transforms extends Record<string, Transform>,
  States extends Record<string, boolean>
>(
  propName: string,
  propValue: unknown,
  transforms: Transforms,
  states: States,
  mediaQueries: Record<string, unknown>
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
      return Object.entries(getStylePropValue(propName, propValue, transforms))
    }

    // If none were available and we made it here, return media query props
    return Object.entries(propValue).map(([stateKey, value]) => [
      mediaQueries[stateKey] || stateKey,
      getStylePropValue(propName, value, transforms),
    ])
  }

  return Object.entries(getStylePropValue(propName, propValue, transforms))
}

function getStylePropValue(name, value, transforms) {
  return transforms[name] ? transforms[name].call(null, value) : value
}
