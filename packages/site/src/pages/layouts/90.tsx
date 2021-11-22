import { Grid, Stack, Spacer } from 'system'

export default function Layout({ children }) {
  return (
    <Grid
      width="100%"
      height="100vh"
      columns={3}
      rows={4}
      space={64}
      spaceBetweenX={0}
      spaceBetweenY={0}
    >
      <Stack column="1/-1" row="1/3">
        <Spacer />
        <Stack axis="x" width="100%" height="100%">
          <Spacer />
          <Stack width="80%" height="25%" background="white" />
          <Spacer />
        </Stack>
        <Spacer />
      </Stack>
      <Stack column="1" row="3" background="rgba(255,255,255,0.5)" />
      <Stack column="2" row="3" background="rgba(255,255,255,0.5)" />
      <Stack column="3" row="3" background="rgba(255,255,255,0.5)" />
      <Stack column="1" row="4" background="rgba(255,255,255,0.5)" />
      <Stack column="2" row="4" background="rgba(255,255,255,0.5)" />
      <Stack column="3" row="4" background="rgba(255,255,255,0.5)" />
    </Grid>
  )
}
