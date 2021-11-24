import { bundleMDX } from 'mdx-bundler'
import { getFiles } from '@/utils/get-files'
import rehypeShiki from 'rehype-shiki'
import * as path from 'path'
import * as fs from 'fs/promises'

export async function getAllDocs() {
  const sourceDirectory = path.join(process.cwd(), 'src/docs')
  const sourceFiles = await getFiles(sourceDirectory, async (file) => {
    if (file.level === -1) {
      return file.children
    }
    const mdxContents = await fs.readFile(file.path, 'utf-8')
    const title = mdxContents.split('\n')[0].slice(1).trim()
    const result = await bundleMDX({
      source: mdxContents,
      cwd: sourceDirectory,
      xdmOptions: (options) => ({
        ...options,
        rehypePlugins: [
          ...(options.rehypePlugins ?? []),
          [
            rehypeShiki,
            { theme: path.resolve(process.cwd(), 'src/theme.json') },
          ],
        ],
      }),
    })
    return {
      name: title,
      slug: file.name,
      mdx: result.code,
    }
  })
  return sourceFiles
}
