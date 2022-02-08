import { createComponent } from '@jsxui/babel-plugin/dist/create-component'

export type SpacerProps = {
  size?: number | string
}

export const Spacer = createComponent<SpacerProps>({
  name: 'Spacer',
  defaults: {
    flex: '1 1 0%',
  },
  transforms: {
    size: (value) => ({
      flex:
        typeof value === 'string' && value.includes('fr')
          ? `${parseInt(value)} ${parseInt(value)} 0%`
          : `0 1 ${typeof value === 'number' ? value + 'px' : value}`,
    }),
  },
  platforms: {
    figma: {
      as: 'View',
      source: 'react-figma',
    },
    ink: {
      as: 'Box',
      source: 'ink',
    },
    native: {
      as: 'View',
      source: 'react-native',
    },
    web: {
      as: 'div',
    },
  },
})
