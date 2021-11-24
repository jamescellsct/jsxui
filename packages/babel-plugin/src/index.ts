import { PluginObj, PluginPass } from '@babel/core'
import jsx from '@babel/plugin-syntax-jsx'

import { addSourceProps } from './add-source-props'
import { transpileOverrideProps } from './overrides'

export default function (): PluginObj<PluginPass> {
  let cache
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      Program: {
        enter() {
          cache = new Set()
        },
      },
      JSXOpeningElement(path, state) {
        addSourceProps(path, state, cache)
        transpileOverrideProps(path, cache)
      },
    },
  }
}
