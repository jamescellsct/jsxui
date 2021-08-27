import { get } from 'https'
import { runAsWorker } from 'synckit'
import { config } from 'dotenv'
import { Client } from 'figma-js'
import svgToJsx from 'svg-to-jsx'
import { existsSync, promises as fs } from 'fs'

config()

const client = Client({ personalAccessToken: process.env.FIGMA_TOKEN })
const cacheDirectory = '.cache'
const cachePath = `${cacheDirectory}/fetch-images.json`

runAsWorker(async ({ fileId, layerNames }) => {
  const file = await client.file(fileId)
  const componentEntries = Object.entries(file.data.components).filter(
    ([_, value]) => layerNames.includes(value.name)
  )

  layerNames.forEach((name) => {
    const values = componentEntries.map(([_, value]) => value.name)
    if (!values.includes(name)) {
      throw Error(
        [
          `<Graphic name="${name}" /> was not exported as a component in the file: ${file.data.name}`,
          `Make sure the layer is a component and is included in the file.`,
        ].join('\n')
      )
    }
  })

  if (componentEntries.length > 0) {
    return getImages({
      fileId,
      layerNames,
      imageIds: componentEntries.map(([id]) => id),
      lastModified: file.data.lastModified,
    })
  }

  throw Error(
    `No components were found in file: ${fileId}. Make sure there is at least one exported component in your Figma file.`
  )
})

async function getImages({ fileId, layerNames, imageIds, lastModified }) {
  const writeCache = async () => {
    const { images } = (
      await client.fileImages(fileId, {
        ids: imageIds,
        format: 'svg',
      })
    ).data
    const jsxSourcesArray = await Promise.all(
      imageIds.map(async (imageId) => {
        const svg = await getImageFromSource(images[imageId])
        const jsx = await svgToJsx(svg)
        return jsx
      })
    )
    const jsxSources = Object.fromEntries(
      jsxSourcesArray.map((source, index) => [layerNames[index], source])
    )
    await fs.writeFile(cachePath, JSON.stringify({ lastModified, jsxSources }))
    return jsxSources
  }

  // prime cache directory
  if (!existsSync(cacheDirectory)) {
    await fs.mkdir(cacheDirectory)
  }

  // try to load from cache if available
  try {
    const contents = JSON.parse(await fs.readFile(cachePath, 'utf-8'))
    if (contents.lastModified === lastModified) {
      return contents.jsxSources
    }
    return writeCache()
  } catch {
    return writeCache()
  }
}

function getImageFromSource(url) {
  return new Promise((resolve, reject) => {
    get(url, (response) => {
      if (response.statusCode === 200) {
        const body: Uint8Array[] = []
        response.on('data', (data) => {
          body.push(data)
        })
        response.on('end', () => {
          resolve(Buffer.concat(body))
        })
      } else {
        reject(response.statusCode)
      }
    })
  })
}
