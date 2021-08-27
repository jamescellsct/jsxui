const { build } = require('esbuild')
const { peerDependencies, dependencies } = require('./package.json')

build({
  entryPoints: [
    'src/index.ts',
    'src/compiler.ts',
    'src/create-component.ts',
    'src/fetch-images.ts',
    'src/graphic.ts',
  ],
  outdir: 'dist',
  bundle: true,
  platform: 'node',
  target: 'es2019',
  external: Object.keys(peerDependencies).concat(Object.keys(dependencies)),
  watch: process.argv.includes('--watch'),
})
