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
      <Text align="center" variant="heading1">
        Your System. Any Platform.
      </Text>
      <Text align="center">
        Connect your design system now and start shipping your next idea.
      </Text>
      <Scene />
    </Grid>
  )
}
