import { PluginObj, PluginPass } from '@babel/core'
import template from '@babel/template'
import jsx from '@babel/plugin-syntax-jsx'

import { createSyncFn } from 'synckit'

const fetchImages = createSyncFn(require.resolve('./fetch-images'))

export default function (): PluginObj<PluginPass> {
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      JSXElement(path, state) {
        if (path.node.openingElement.name.name === 'Graphic') {
          const props = Object.fromEntries(
            path.node.openingElement.attributes
              .filter((attribute) => attribute.type === 'JSXAttribute')
              .map((attribute) => [attribute.name.name, attribute.value.value])
          )
          const options = {
            ...state.opts,
            ...props,
          }
          if (options.fileId && options.name) {
            const jsx = fetchImages(options)
            const ast = template.ast(jsx, { plugins: ['jsx'] })
            path.replaceWith(ast.expression)
          }
        }
      },
    },
  }
}
