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
            const restAttributes = path.node.openingElement.attributes.filter(
              (attribute) => !['name', 'fileId'].includes(attribute.name.name)
            )
            const jsx = fetchImages(options)
            const ast = template.ast(jsx, { plugins: ['jsx'] })

            // merge any remaining attributes that should be passed along
            const mergedAttributes = [
              ...ast.expression.openingElement.attributes,
              ...restAttributes,
            ]

            // remove any preceding duplicates and set new attributes
            ast.expression.openingElement.attributes = mergedAttributes.filter(
              (attribute, index) => {
                let duplicateIndex = -1
                mergedAttributes.forEach((possibleDuplicate, index) => {
                  if (possibleDuplicate.name.name === attribute.name.name) {
                    duplicateIndex = index
                  }
                })
                return duplicateIndex > -1 ? duplicateIndex === index : true
              }
            )

            // finally replace our Graphic component with the compiled svg
            path.replaceWith(ast.expression)
          }
        }
      },
    },
  }
}
