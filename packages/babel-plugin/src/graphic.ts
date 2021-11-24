import { PluginObj, PluginPass } from '@babel/core'
import template from '@babel/template'
import * as t from '@babel/types'
import jsx from '@babel/plugin-syntax-jsx'
import { createSyncFn } from 'synckit'

import { filterDuplicates } from './utils'

let fetchImages

try {
  fetchImages = createSyncFn(require.resolve('./fetch-images'))
} catch (error) {
  console.log(error)
}

// TODO: were doing a lot of traversing here, look into doing it a more performant way
export default function (): PluginObj<PluginPass> {
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      Program(path, state) {
        const layerNames = []

        path.traverse(propsVisitor, { layerNames })

        if (layerNames.length > 0) {
          const jsxSources = fetchImages({
            fileId: state.opts.fileId,
            fileName: state.filename,
            layerNames,
          })

          path.traverse(elementVisitor, { jsxSources })
        }
      },
    },
  }
}

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
        ast.expression.openingElement.attributes = filterDuplicates(
          mergedAttributes,
          (attribute) => attribute.name.name
        )

        // store transforms from <Layer /> components
        const layerTransforms = {}

        // find all layer components and their transforms
        path.traverse(layerVisitor, { layerTransforms })

        // replace <Graphic /> component with the compiled svg
        path.replaceWith(ast.expression)

        // now traverse the svg to apply any transforms
        if (Object.keys(layerTransforms).length > 0) {
          path.traverse(svgElementVisitor, { layerTransforms })
        }
      }
    }
  },
}

const layerVisitor = {
  JSXOpeningElement(path, state) {
    if (path.node.name.name === 'Layer') {
      const { name, ...restProps } = Object.fromEntries(
        path.node.attributes
          .filter((attribute) => attribute.type === 'JSXAttribute')
          .map((attribute) => [attribute.name.name, attribute])
      )

      state.layerTransforms[name.value.value] = restProps
    }
  },
}

const svgElementVisitor = {
  JSXElement(path, state) {
    const idAttribute = path.node.openingElement.attributes.find(
      (attribute) => attribute.name.name === 'id'
    )

    if (idAttribute) {
      const transformAttributes = state.layerTransforms[idAttribute.value.value]

      if (transformAttributes) {
        const { as, ...restAttributes } = transformAttributes

        if (as.value.type === 'JSXExpressionContainer') {
          const { object, property } = as.value.expression
          const expression = t.jsxMemberExpression(
            t.jsxIdentifier(object.name),
            t.jsxIdentifier(property.name)
          )

          path.node.openingElement.name = expression

          if (path.node.closingElement) {
            path.node.closingElement.name = expression
          }
        } else {
          path.node.openingElement.name.name = as.value.value

          if (path.node.closingElement) {
            path.node.closingElement.name.name = as.value.value
          }
        }

        if (restAttributes) {
          path.node.openingElement.attributes = filterDuplicates(
            [
              ...path.node.openingElement.attributes,
              ...Object.values(restAttributes),
            ],
            (attribute) => attribute.name.name
          )
        }
      }

      // Remove id attribute from SVG since we don't need it
      path.node.openingElement.attributes =
        path.node.openingElement.attributes.filter(
          (attribute) => attribute.name.name !== 'id'
        )
    }
  },
}
