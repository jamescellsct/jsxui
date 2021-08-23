export default function Index() {
  return (
    <Stack
      axis="x"
      width={{
        default: 300,
        'breakpoints.small': 500,
      }}
    >
      <Text>Hello</Text>
      <Spacer />
      <Text>World</Text>
    </Stack>
  )
}
