import { get } from 'https'
import { runAsWorker } from 'synckit'
import { config } from 'dotenv'
import { Client } from 'figma-js'
import svgToJsx from 'svg-to-jsx'

config()

runAsWorker(async ({ fileId, name }) => {
  const client = Client({ personalAccessToken: process.env.FIGMA_TOKEN })
  const file = await client.file(fileId)
  const entry = Object.entries(file.data.components).find(
    ([_, value]) => value.name === name
  )
  if (entry) {
    const [imageId] = entry
    const { images } = (
      await client.fileImages(fileId, {
        ids: [imageId], // TODO: collect all ids in file and fetch all at once
        format: 'svg',
      })
    ).data
    const svg = await getImageFromSource(images[imageId])
    const jsx = await svgToJsx(svg)
    return jsx
  }
  return null
})

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
