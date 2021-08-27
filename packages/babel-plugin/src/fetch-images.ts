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

runAsWorker(async ({ fileId, name }) => {
  const file = await client.file(fileId)
  const entry = Object.entries(file.data.components).find(
    ([_, value]) => value.name === name
  )
  if (entry) {
    const [imageId] = entry
    return getImage(fileId, imageId, file.data.lastModified)
  }
  return null
})

async function getImage(fileId, imageId, lastModified) {
  const writeCache = async () => {
    const { images } = (
      await client.fileImages(fileId, {
        ids: [imageId], // TODO: collect all ids in file and fetch all at once
        format: 'svg',
      })
    ).data
    const svg = await getImageFromSource(images[imageId])
    const jsx = await svgToJsx(svg)
    await fs.writeFile(cachePath, JSON.stringify({ lastModified, jsx }))
    return jsx
  }

  // prime cache directory
  if (!existsSync(cacheDirectory)) {
    await fs.mkdir(cacheDirectory)
  }

  // try to load from cache if available
  try {
    const contents = JSON.parse(await fs.readFile(cachePath, 'utf-8'))
    if (contents.lastModified === lastModified) {
      return contents.jsx
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
