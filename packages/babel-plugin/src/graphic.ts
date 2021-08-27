import { PluginObj, PluginPass } from '@babel/core'
import template from '@babel/template'
import jsx from '@babel/plugin-syntax-jsx'

import { createSyncFn } from 'synckit'

const fetchImages = createSyncFn(require.resolve('./fetch-images'))

const propsVisitor = {
  JSXOpeningElement(path, state) {
    if (path.node.name.name === 'Graphic') {
      const nameAttribute = path.node.attributes.find(
        (attribute) => attribute.name.name === 'name'
      )
      if (nameAttribute) {
        state.layerNames.push(nameAttribute.value.value)
      }
    }
  },
}

const elementVisitor = {
  JSXElement(path, state) {
    if (path.node.openingElement.name.name === 'Graphic') {
      const nameAttribute = path.node.openingElement.attributes.find(
        (attribute) => attribute.name.name === 'name'
      )
      const layerName = nameAttribute.value.value
      if (layerName) {
        const restAttributes = path.node.openingElement.attributes.filter(
          (attribute) => attribute.name.name !== 'name'
        )
        const jsx = state.jsxSources[layerName]
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
}

export default function (): PluginObj<PluginPass> {
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      Program(path, state) {
        const layerNames = []
        path.traverse(propsVisitor, { layerNames })
        const jsxSources = fetchImages({
          fileId: state.opts.fileId,
          layerNames,
        })
        path.traverse(elementVisitor, { jsxSources })
      },
    },
  }
}
