import { PluginObj, PluginPass } from '@babel/core'
import * as t from '@babel/types'
import jsx from '@babel/plugin-syntax-jsx'
import get from 'dlv'

type PluginOptions = {
  opts: {
    // TODO: rename to elements to better match what they're called in the AST?
    components: {
      /** The name of the component. */
      name: string

      /** What element should this component render as. */
      as: string

      /** What library should this component be imported from. */
      source?: string

      /** What default styles should be applied before merging style props. */
      defaults?: any

      /** Style props to process. */
      props?: any

      /** Transforms to be ran for specific props. */
      transforms?: any
    }[]

    /** Common values reused throughout your components. */
    theme:
      | (string & {})
      | {
          /** The threshold for layouts across specific screen sizes. */
          breakpoints: any
        }

    /** Describe how style props should be mapped to the respecitve platform. */
    visitor: any
  }
} & PluginPass

function getValueType(
  value
): t.BooleanLiteral | t.NumericLiteral | t.StringLiteral {
  return typeof value === 'boolean'
    ? t.booleanLiteral(value)
    : typeof value === 'number'
    ? t.numericLiteral(value)
    : typeof value === 'string'
    ? t.stringLiteral(value)
    : value
}

function getValue(node) {
  return node.type === 'NumericLiteral' ? node.value : node.value
}

export default function (_, state): PluginObj<PluginOptions> {
  const {
    platform = 'web',
    theme = {},
    visitors = {},
    ...rawComponents
  } = state.entry ? require(state.entry) : state
  const visitor = visitors[platform]
  const components = Object.entries(rawComponents)
    .filter(([key]) => key !== 'default')
    .map(([, component]) => {
      const { platforms, ...componentConfig } = component.config
      return {
        ...platforms[platform],
        ...componentConfig,
      }
    })
  let styleAttributes, styleProperties
  return {
    name: '@jsxui/babel-plugin',
    inherits: jsx,
    visitor: {
      // TODO: since this plugin manipulates props we need to run it before
      // any other plugin since Babel operates on each node of a plugin at once.
      // Otherwise we end up with transformed JSX which is harder to analyze/modify.
      // https://jamie.build/babel-plugin-ordering.html
      Program: {
        enter() {
          styleAttributes = {}
          styleProperties = {}
        },
        exit(path) {
          const importDeclarations = {}

          components.forEach((component) => {
            if (component.source) {
              const importDeclaration = importDeclarations[component.source]
              if (importDeclaration === undefined) {
                importDeclarations[component.source] = []
              }
              if (!importDeclaration?.includes(component.as)) {
                importDeclarations[component.source].push(component.as)
              }
            }
          })

          let importEntries = Object.entries(importDeclarations)
          let containsImportDeclaration = false

          if (importEntries.length > 0) {
            // TODO: move this visitor out in a constant and pass state for better performance
            path.traverse({
              ImportDeclaration(path) {
                /**
                 * Determine if library is already imported and if it is add
                 * the specifier to that.
                 */
                const componentImports =
                  importDeclarations[path.node.source.value]
                if (componentImports) {
                  containsImportDeclaration = true

                  // Filter out from imports since we don't need to add the source
                  importEntries = importEntries.filter(
                    ([key]) => key === path.node.source.value
                  )

                  // Loop through component imports and add them
                  componentImports
                    // Filter out any specifiers that are already defined
                    .filter(
                      (componentName) =>
                        !path.node.specifiers
                          .map((specifier) => specifier.local.name)
                          .includes(componentName)
                    )
                    .forEach((componentName) => {
                      path.node.specifiers.push(
                        t.importSpecifier(
                          t.identifier(componentName),
                          t.identifier(componentName)
                        )
                      )
                    })
                }
              },
            })

            if (!containsImportDeclaration) {
              importEntries.forEach(([source, componentImports]) => {
                const importDeclaration = t.importDeclaration(
                  componentImports.map((componentName) =>
                    t.importSpecifier(
                      t.identifier(componentName),
                      t.identifier(componentName)
                    )
                  ),
                  t.stringLiteral(source)
                )
                path.unshiftContainer('body', importDeclaration)
              })
            }
          }

          if (visitor.Program) {
            const state = { styleAttributes, styleProperties }
            if (visitor.Program) {
              visitor.Program.call(state, path, state)
            }
            if (visitor.Program.enter) {
              throw Error(
                'Program.enter does not exist in this visitor pattern.'
              )
            }
            if (visitor.Program.exit) {
              throw Error(
                'Program.exit does not exist in this visitor pattern.'
              )
            }
          }
        },
      },
      JSXElement(path) {
        const component = components.find(
          (component) => path.node.openingElement.name.name === component.name
        )

        if (component) {
          const id = path.scope.generateUidIdentifier(component.name)

          path.node.openingElement.name.name = component.as
          if (path.node.closingElement) {
            path.node.closingElement.name.name = component.as
          }

          const attributes: Array<t.JSXAttribute> = []
          const defaultProperties: Array<t.ObjectProperty> = []
          const localStyleAttributes: Array<t.JSXAttribute> = []
          const localStyleProperties: Array<t.ObjectProperty> = []
          const variantStyleProperties: Array<[any, t.ObjectProperty]> = []
          const breakpointProperties = {}

          // TODO: defaults should work exactly like values and allow specifying
          // media queries, this can work nice for components like Stack that can
          // automatically default to y axis at smaller widths
          if (component.defaults) {
            Object.entries(component.defaults).forEach(([key, value]) => {
              localStyleAttributes.push(
                t.jsxAttribute(
                  t.jsxIdentifier(key),
                  t.jsxExpressionContainer(getValueType(value))
                )
              )
            })
            Object.entries(component.defaults).forEach(([key, value]) => {
              defaultProperties.push(
                t.objectProperty(t.identifier(key), getValueType(value))
              )
            })
          }

          const openingElementAttributes =
            path.node.openingElement.attributes.filter(
              (attribute) => attribute.type !== 'JSXSpreadAttribute'
            ) as Array<t.JSXAttribute>

          openingElementAttributes.forEach((attribute) => {
            const transform = component.transforms[attribute.name.name]

            /**
             * The visible prop is special and allows completely removing an element
             * for a specific breakpoint or platform.
             */
            if (attribute.name.name === 'visible') {
              // TODO: implement "visible" prop
              // will this just be platform specific and implemented per visitor?
              // web for instance will use display: none, but native should return null?
            }

            if (attribute.name.name === 'as') {
              path.node.openingElement.name.name = attribute.value.value
              if (path.node.closingElement) {
                path.node.closingElement.name.name = attribute.value.value
              }
            }

            if (attribute.name.name === 'variant') {
              const variant = component.variants[attribute.value.value]
              const platformVariant = variant[platform]

              // TODO: process rest of platform variant attributes and run them through transforms
              path.node.openingElement.name.name = platformVariant.as
              if (path.node.closingElement) {
                path.node.closingElement.name.name = platformVariant.as
              }

              Object.entries(variant.defaults).forEach(([key, value]) => {
                const transform = component.transforms[key]
                if (transform !== undefined) {
                  const transformedValue = transform(value, theme)
                  if (typeof transformedValue === 'object') {
                    Object.entries(transformedValue).forEach(([key, value]) => {
                      localStyleAttributes.push(
                        t.jsxAttribute(
                          t.jsxIdentifier(key),
                          t.jsxExpressionContainer(getValueType(value))
                        )
                      )
                      localStyleProperties.push(
                        t.objectProperty(t.identifier(key), getValueType(value))
                      )
                    })
                  } else {
                    localStyleAttributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(key),
                        t.jsxExpressionContainer(getValueType(transformedValue))
                      )
                    )
                    localStyleProperties.push(
                      t.objectProperty(
                        t.identifier(key),
                        getValueType(transformedValue)
                      )
                    )
                  }
                }
              })
            }

            /**
             * Create an object property to make it easier when writing platform
             * visitors. Alternatively, we can store this as an actual object and
             * let users compose them however (e.g. writing to template literals).
             */
            if (transform !== undefined) {
              if (attribute.value.type === 'JSXExpressionContainer') {
                const expression = attribute.value.expression

                // <Stack axis={[['default', 'x'], ['breakpoints.medium', 'y']]} />
                if (expression.type === 'ArrayExpression') {
                  expression.elements.forEach((nestedExpression) => {
                    const [variant, value] = nestedExpression.elements
                    const transformedValue = transform(value.value, theme)
                    const variantName =
                      variant.type === 'StringLiteral' && variant.value
                    if (variantName && variantName.includes('breakpoints')) {
                      const breakpoint = get(theme, variantName)
                      const transformedValue = transform(getValue(value), theme)

                      if (breakpointProperties[breakpoint] === undefined) {
                        breakpointProperties[breakpoint] = []
                      }

                      if (typeof transformedValue === 'object') {
                        Object.entries(transformedValue).forEach(
                          ([key, value]) => {
                            breakpointProperties[breakpoint].push(
                              t.objectProperty(
                                t.identifier(key),
                                getValueType(value)
                              )
                            )
                          }
                        )
                      } else {
                        breakpointProperties[breakpoint].push(
                          t.objectProperty(
                            t.identifier(attribute.name.name),
                            getValueType(transformedValue)
                          )
                        )
                      }
                    } else if (variantName === 'default') {
                      const transformedValue = transform(getValue(value), theme)
                      if (typeof transformedValue === 'object') {
                        Object.entries(transformedValue).forEach(
                          ([key, value]) => {
                            localStyleAttributes.push(
                              t.jsxAttribute(
                                t.jsxIdentifier(key),
                                t.jsxExpressionContainer(getValueType(value))
                              )
                            )
                            localStyleProperties.push(
                              t.objectProperty(
                                t.identifier(key),
                                getValueType(value)
                              )
                            )
                          }
                        )
                      } else {
                        localStyleAttributes.push(
                          t.jsxAttribute(
                            t.jsxIdentifier(attribute.name.name),
                            t.jsxExpressionContainer(
                              getValueType(transformedValue)
                            )
                          )
                        )
                        localStyleProperties.push(
                          t.objectProperty(
                            t.identifier(attribute.name.name),
                            getValueType(transformedValue)
                          )
                        )
                      }
                    } else if (typeof transformedValue === 'object') {
                      variantStyleProperties.push([
                        variant,
                        Object.entries(transformedValue).map(([key, value]) =>
                          t.objectProperty(
                            t.identifier(key),
                            getValueType(value)
                          )
                        ),
                      ])
                    } else {
                      variantStyleProperties.push([
                        variant,
                        [
                          t.objectProperty(
                            t.identifier(attribute.name.name),
                            getValueType(transformedValue)
                          ),
                        ],
                      ])
                    }
                  })
                } else if (expression.type === 'ObjectExpression') {
                  expression.properties.forEach((property) => {
                    if (property.key.name === 'default') {
                      const transformedValue = transform(
                        property.value.value,
                        theme
                      )
                      if (typeof transformedValue === 'object') {
                        Object.entries(transformedValue).forEach(
                          ([key, value]) => {
                            localStyleAttributes.push(
                              t.jsxAttribute(
                                t.jsxIdentifier(key),
                                t.jsxExpressionContainer(getValueType(value))
                              )
                            )
                            localStyleProperties.push(
                              t.objectProperty(
                                t.identifier(key),
                                getValueType(value)
                              )
                            )
                          }
                        )
                      } else {
                        localStyleAttributes.push(
                          t.jsxAttribute(
                            t.jsxIdentifier(attribute.name.name),
                            t.jsxExpressionContainer(
                              getValueType(transformedValue)
                            )
                          )
                        )
                        localStyleProperties.push(
                          t.objectProperty(
                            t.identifier(attribute.name.name),
                            getValueType(transformedValue)
                          )
                        )
                      }
                    } else {
                      const breakpoint = get(theme, property.key.value)
                      const transformedValue = transform(
                        property.value.value,
                        theme
                      )

                      if (breakpointProperties[breakpoint] === undefined) {
                        breakpointProperties[breakpoint] = []
                      }

                      if (typeof transformedValue === 'object') {
                        Object.entries(transformedValue).forEach(
                          ([key, value]) => {
                            breakpointProperties[breakpoint].push(
                              t.objectProperty(
                                t.identifier(key),
                                getValueType(value)
                              )
                            )
                          }
                        )
                      } else {
                        breakpointProperties[breakpoint].push(
                          t.objectProperty(
                            t.identifier(attribute.name.name),
                            getValueType(transformedValue)
                          )
                        )
                      }
                    }
                  })
                } else {
                  // <Stack axis={'x'} />
                  const transformedValue = transform(expression.value, theme)
                  if (typeof transformedValue === 'object') {
                    Object.entries(transformedValue).forEach(([key, value]) => {
                      // localStyleAttributes.push(
                      //   t.jsxAttribute(
                      //     t.jsxIdentifier(key),
                      //     t.jsxExpressionContainer(getValueType(value))
                      //   )
                      // )
                      localStyleProperties.push(
                        t.objectProperty(t.identifier(key), getValueType(value))
                      )
                    })
                  } else {
                    // localStyleAttributes.push(
                    //   t.jsxAttribute(
                    //     t.jsxIdentifier(attribute.name.name),
                    //     t.jsxExpressionContainer(getValueType(transformedValue))
                    //   )
                    // )
                    localStyleProperties.push(
                      t.objectProperty(
                        t.identifier(attribute.name.name),
                        getValueType(transformedValue)
                      )
                    )
                  }
                }
              } else {
                const transformedValue = transform(attribute.value.value, theme)

                // TODO: how to handle if prop value itself is an object? (e.g. translate={{ x: -5, y: 10 }} )
                // Can we use types to determine or should we only support simple
                // primitive values like string/number?
                if (typeof transformedValue === 'object') {
                  Object.entries(transformedValue).forEach(([key, value]) => {
                    localStyleAttributes.push(
                      t.jsxAttribute(
                        t.jsxIdentifier(key),
                        t.jsxExpressionContainer(getValueType(value))
                      )
                    )
                    localStyleProperties.push(
                      t.objectProperty(t.identifier(key), getValueType(value))
                    )
                  })
                } else {
                  localStyleAttributes.push(
                    t.jsxAttribute(
                      t.jsxIdentifier(attribute.name.name),
                      t.jsxExpressionContainer(getValueType(transformedValue))
                    )
                  )
                  localStyleProperties.push(
                    t.objectProperty(
                      t.identifier(attribute.name.name),
                      getValueType(transformedValue)
                    )
                  )
                }
              }
            } else {
              attributes.push(attribute)
            }
          })

          if (localStyleAttributes.length > 0) {
            styleAttributes[id.name] = localStyleAttributes.filter(
              (attribute, index) => {
                const sameAttributes = localStyleAttributes.filter(
                  ({ name }) => name.name === attribute.name.name
                )
                return sameAttributes.length > 1
                  ? sameAttributes.length === index
                  : true
              }
            )
          }

          if (localStyleProperties.length > 0) {
            styleProperties[id.name] = [
              ...defaultProperties,
              ...localStyleProperties.filter((property, index) => {
                // if same value is present we take the last one since it will
                // be overwritten anyways
                const sameProperties = localStyleProperties.filter(
                  ({ key }) => key.name === property.key.name
                )
                return sameProperties.length > 1
                  ? sameProperties.length === index
                  : true
              }),
              ...Object.entries(breakpointProperties).reduce(
                (previousValue, [key, properties]) => [
                  ...previousValue,
                  t.objectProperty(
                    t.stringLiteral(key),
                    t.objectExpression(properties)
                  ),
                ],
                []
              ),
            ]
          } else {
            styleProperties[id.name] = defaultProperties
          }

          path.node.openingElement.attributes = attributes.filter(
            (attribute) =>
              attribute.name.name !== 'as' && attribute.name.name !== 'variant'
          )

          if (visitor.JSXElement) {
            const state = {
              id: id.name,
              styleAttributes: styleAttributes[id.name],
              styleProperties: styleProperties[id.name],
              variantStyleProperties,
            }
            if (visitor.JSXElement) {
              visitor.JSXElement.call(state, path, state)
            }
          }
        }
      },
    },
  }
}
