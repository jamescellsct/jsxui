import jsxuiPlugin from '@jsxui/babel-plugin/dist/compiler'
import { transform } from '@babel/standalone'
import { format } from './format'

import * as system from 'system'

export function compile(codeString, platform = 'web') {
  try {
    const { code } = transform(codeString, {
      plugins: [[jsxuiPlugin, { platform, ...system }]],
    })
    return format(code)
  } catch (err) {
    console.error('Error Compiling:', err)
    return codeString
  }
}
