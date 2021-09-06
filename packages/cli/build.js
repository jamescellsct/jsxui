const { build } = require('esbuild')
const { dependencies } = require('./package.json')

build({
  entryPoints: ['src/index.tsx'],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  target: 'es2019',
  external: Object.keys(dependencies),
  watch: process.argv.includes('--watch'),
})
