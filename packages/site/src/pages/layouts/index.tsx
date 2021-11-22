import { Grid, Stack, Text } from 'system'

export default function Layout({ children }) {
  return (
    <Grid
      width="100%"
      height="100vh"
      columns={6}
      rows={4}
      space={16}
      //   space={16}
      // background={<Fill color="purple" />}
    >
      <Stack column="1" row="1/-1" background="brandShade" />
      <Grid
        column="1/5"
        row="1"
        rows={4}
        columns={2}
        spaceBetweenX={16}
        spaceBetweenY={16}
      >
        <Stack column="1" row="2" background="rgba(255,255,255,0.75)" />
        <Stack column="2" row="2/4" background="rgba(255,255,255,0.5)" />
      </Grid>
      <Stack column="3/5" row="2" cornerRadius={40} background="white" />
      <Stack column="5/7" row="2" cornerRadius={40} background="white" />
      <Stack column="1/3" row="4" cornerRadius={40} background="white" />
      <Stack column="3/7" row="3/5" cornerRadius={40} background="white" />
    </Grid>
  )
}
