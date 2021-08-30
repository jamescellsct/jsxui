import * as prettier from 'prettier/standalone'
import tsParser from 'prettier/parser-typescript'

export function format(codeString, printWidth = 80) {
  try {
    const formattedCode = prettier.format(codeString, {
      plugins: [tsParser],
      parser: 'typescript',
      semi: false,
      printWidth,
    })
    const trimmedCode = formattedCode.trimEnd()
    // trim semicolons at the beginning
    if (trimmedCode[0] === ';') {
      return trimmedCode.slice(1)
    }
    return trimmedCode
  } catch (err) {
    console.error('Error Formatting:', err)
    return codeString
  }
}
