#!/usr/bin/env node
import React, { useEffect } from 'react'
import { promises as fs } from 'fs'
import { Text, useInput, render, Box } from 'ink'
import terminalImage from 'terminal-image'
import path from 'path'
import { register } from 'esbuild-register/dist/node'

register({
  target: 'esnext',
})

terminalImage
  .file(path.resolve(__dirname, '../images/logo.png'))
  .then((data) => console.log(data))

const configPath = path.resolve(process.cwd(), './jsxui.config.ts')
const { source } = require(configPath).default
const system = require(path.resolve(process.cwd(), source))
console.log(system)

function App() {
  useInput((input) => {
    if (input === 'c') {
      fs.writeFile('test.js', 'Hello World!').then(() => {
        console.log('File created ✅')
      })
    }
  })
  return (
    <Box justifyContent="center">
      <Text>Welcome to JSXUI</Text>
    </Box>
  )
}

render(<App />)
