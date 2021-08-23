import * as React from 'react'

const defaultPlatform = 'web'

export function createComponent<T>(config) {
  const platformConfig = config.platforms[defaultPlatform]
  const Component = (props: T) => {
    return React.createElement(platformConfig.as, props)
  }
  Component.displayName = config.name
  Component.config = config
  return Component
}
