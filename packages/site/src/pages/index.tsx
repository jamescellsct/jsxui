import dynamic from 'next/dynamic'
import { Text } from 'system'

const Scene = dynamic(() => import('../components/Scene'), { ssr: false })

export default function Index() {
  return (
    <>
      <Text variant="heading1">Heading</Text>
      <Text>Body</Text>
      <Scene />
    </>
  )
}
