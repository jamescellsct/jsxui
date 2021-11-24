import { Grid, Stack, Spacer } from 'system'

export default function Layout({ children }) {
  return (
    <Grid
      width="100%"
      height="100vh"
      columns={5}
      rows={3}
      space={16}
      spaceBetweenY={16}
    >
      <Stack column="1" row="1" background="white" />
      <Stack column="1" row="2" background="white" />
      <Stack column="2" row="1/3" background="white" />
      <Stack column="3/5" row="1/3" background="white" />
      <Stack column="5" row="1" background="white" />
      <Stack column="5" row="2" background="white" />
      <Stack column="1" row="3">
        <Stack height="25%" background="rgba(255,255,255,0.5)" />
      </Stack>
      <Stack column="2" row="3">
        <Stack height="50%" background="rgba(255,255,255,0.5)" />
      </Stack>
      <Stack column="5" row="3">
        <Stack height="50%" background="rgba(255,255,255,0.5)" />
        <Spacer size={16} />
        <Stack width="60%" height="10%" background="rgba(255,255,255,0.5)" />
      </Stack>
    </Grid>
  )
}
