export default function App() {
  return (
    <Stack
      axis="x"
      width="container.medium"
      spaceX={{
        default: 16,
        'breakpoints.large': 'xlarge',
      }}
      spaceY={40}
      spaceYEnd="80px"
    >
      <Text color="brand">Hello World</Text>
    </Stack>
  )
}
