import * as React from 'react'
import {
  PolymorphicForwardRefExoticComponent,
  PolymorphicPropsWithoutRef,
  PolymorphicPropsWithRef,
} from 'react-polymorphic-types'

const defaultPlatform = 'web'

// TODO: should this component be generated per platform rather than be imported?
export function createComponent<T>(config) {
  const platformConfig = config.platforms[defaultPlatform]
  const Component = (props: T) => {
    return React.createElement(platformConfig.as, props)
  }
  Component.displayName = config.name
  Component.config = config
  return Component
}
