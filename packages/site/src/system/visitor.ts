import * as t from '@babel/types'
import template from '@babel/template'

const webVisitor = {
  JSXElement(path, state) {
    if (state.defaultEntries.length > 0) {
      const properties = [
        t.objectExpression([
          ...state.defaultEntries.map(([key, value]) =>
            t.objectProperty(t.identifier(key), value)
          ),
          ...state.breakpointEntries.reduce(
            (previousValue, [key, properties]) => [
              ...previousValue,
              t.objectProperty(
                t.stringLiteral(key),
                t.objectExpression(
                  properties.map(([key, value]) =>
                    t.objectProperty(t.stringLiteral(key), value)
                  )
                )
              ),
            ],
            []
          ),
          ...state.transformEntries,
        ]),
        ...state.variantEntries.reduce(
          (variantProps, [variant, properties]) => [
            ...variantProps,
            t.logicalExpression(
              '&&',
              variant,
              t.objectExpression(
                properties.map(([key, value]) =>
                  t.objectProperty(t.stringLiteral(key), value)
                )
              )
            ),
          ],
          []
        ),
      ]
      const cssAttribute = path
        .get('openingElement')
        .get('attributes')
        .find((attribute) => {
          return attribute.node.name && attribute.node.name.name === 'css'
        })
      if (cssAttribute) {
        properties.push(cssAttribute.node.value.expression)
        cssAttribute.remove()
      }
      if (path.node.openingElement.attributes)
        path.node.openingElement.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('css'),
            t.jsxExpressionContainer(
              properties.length > 1
                ? t.arrayExpression(properties)
                : properties[0]
            )
          )
        )
    }
  },
}

const figmaVisitor = {
  JSXElement(path, state) {
    if (state.styleProperties.length > 0) {
      path.node.openingElement.attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier('style'),
          t.jsxExpressionContainer(t.objectExpression(state.styleProperties))
        )
      )
    }
  },
}

const inkVisitor = {
  JSXElement(path, state) {
    if (state.styleAttributes.length > 0) {
      path.node.openingElement.attributes =
        path.node.openingElement.attributes.concat(state.styleAttributes)
    }
  },
}

const buildStylesheet = template(`
const styles = StyleSheet.create(STYLES)
`)

// TODO: fix native visitor, we need to merge visitors together and call with respective state for JSXElement/JSXOpeningElement
const nativeVisitor = {
  Program(path, state) {
    path.pushContainer(
      'body',
      buildStylesheet({
        STYLES: t.objectExpression(
          Object.entries(state.styleProperties).map(([id, styleProperties]) =>
            t.objectProperty(
              t.identifier(id),
              t.objectExpression(styleProperties)
            )
          )
        ),
      })
    )
  },
  ImportDeclaration(path) {
    if (path.node.source.value === 'react-native') {
      path.node.specifiers.push(
        t.importSpecifier(
          t.identifier('StyleSheet'),
          t.identifier('StyleSheet')
        )
      )
    }
  },
  JSXElement(path, state) {
    path.node.openingElement.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier('style'),
        t.jsxExpressionContainer(
          t.memberExpression(t.identifier('styles'), t.identifier(state.id))
        )
      )
    )
  },
}

export const visitors = {
  figma: figmaVisitor,
  ink: inkVisitor,
  native: nativeVisitor,
  web: webVisitor,
}
