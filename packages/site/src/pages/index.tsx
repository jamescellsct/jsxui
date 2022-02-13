import dynamic from 'next/dynamic'
import { Grid, Text } from 'system'

const Scene = dynamic(() => import('../components/Scene'), { ssr: false })

export default function Index() {
  return (
    <Grid
      columns={{
        small: 'repeat(6, minmax(0, 1fr))',
        medium: 'repeat(12, minmax(0, 1fr))',
        large: 'repeat(12, 100px)',
      }}
      margin={{ small: 16, medium: 32, large: '1fr' }}
      background="background"
    >
      <Text variant="heading1">Heading</Text>
      <Text>Body</Text>
      <Scene />
    </Grid>
  )
}
