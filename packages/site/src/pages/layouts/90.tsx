import { Grid, Stack, Spacer } from 'system'

function Feature({ column, row }) {
  return <Stack column={column} row={row} stroke="rgba(255,255,255,0.5)" />
}

export default function Layout() {
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
      <Feature column="1" row="3" />
      <Feature column="2" row="3" />
      <Feature column="3" row="3" />
      <Feature column="1" row="4" />
      <Feature column="2" row="4" />
      <Feature column="3" row="4" />
    </Grid>
  )
}
