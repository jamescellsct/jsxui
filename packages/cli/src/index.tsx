#!/usr/bin/env node
import React from 'react'
import { promises as fs } from 'fs'
import { Text, useInput, render, Box } from 'ink'
import terminalImage from 'terminal-image'
import path from 'path'

terminalImage
  .file(path.resolve(__dirname, '../images/logo.png'))
  .then((data) => console.log(data))

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
