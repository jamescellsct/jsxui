import withMDX from '@next/mdx'
import gfm from 'remark-gfm'
import shiki from 'rehype-shiki'
import withRemoteRefresh from 'next-remote-refresh'

export default withRemoteRefresh({
  paths: [process.cwd() + '/src/docs'],
  ignored: null,
})(
  withMDX({
    extension: /\.mdx?$/,
    options: {
      providerImportSource: '@mdx-js/react',
    },
  })({
    pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
    typescript: {
      ignoreBuildErrors: true,
    },
    webpack(config, options) {
      // Load local MDX files and add MDXLayout to each file
      config.module.rules.push({
        test: /\.mdx$/,
        use: [
          options.defaultLoaders.babel,
          {
            loader: '@mdx-js/loader',
            options: {
              remarkPlugins: [gfm],
              rehypePlugins: [[shiki, { theme: 'src/theme.json' }]],
            },
          },
          // Use a custom loader to add MDXLayout to each MDX file
          'mdx-loader.mjs',
        ],
      })

      return config
    },
  })
)
