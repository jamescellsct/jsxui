import pluginTester from 'babel-plugin-tester'
import path from 'path'

import plugin from './compiler'
// import plugin from './graphic'

pluginTester({
  plugin,
  pluginName: '@jsxui/babel-plugin',
  pluginOptions: {
    entry: path.resolve(__dirname, '../../site/system'),
    // fileId: '4nkPu4S33R3FDsqUCTfpmy',
  },
  filename: __filename,
  snapshot: true,
  tests: [
    // { fixture: '__fixtures__/site.js' },
    // { fixture: '__fixtures__/spacer.js' },
    // { fixture: '__fixtures__/visibility.js' },
    // { fixture: '__fixtures__/ink.js' },
    // { fixture: '__fixtures__/multiple-props.js' },
    // { fixture: '__fixtures__/empty.js' },
    // { fixture: '__fixtures__/react-figma.js' },
    // { fixture: '__fixtures__/modifiers.js' },
    // { fixture: '__fixtures__/variants.js' },
    // { fixture: '__fixtures__/props.js' },
    // { fixture: '__fixtures__/simple.js' },
    // { fixture: '__fixtures__/variable.js' },
    // { fixture: '__fixtures__/graphic.js' },
    // { fixture: '__fixtures__/expression.js' },
    { fixture: '__fixtures__/as.js' },
  ],
})
