export default function App() {
  return (
    <Stack
      visible={{
        // default: true, this is the default value for default so no need to add
        'breakpoints.large': false, // will not render at this breakpoint
        'platform.web': false, // will not render when built for this platform
      }}
    >
      <Text>Hello World</Text>
    </Stack>
  )
}
