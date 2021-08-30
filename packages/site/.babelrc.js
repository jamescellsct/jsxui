require('esbuild-register/dist/node').register({
  target: 'es2020',
})

module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      },
    ],
  ],
  plugins: [
    ['@jsxui/babel-plugin/dist/graphic', { fileId: '4nkPu4S33R3FDsqUCTfpmy' }],
    [
      '@jsxui/babel-plugin/dist/compiler',
      { entry: require('path').resolve(__dirname, './src/system') },
    ],
    '@emotion/babel-plugin',
  ],
}
