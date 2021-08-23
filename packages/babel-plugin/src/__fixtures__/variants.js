import { Stack, Text } from 'system'

export default function App({ active }) {
  return (
    <Stack spaceBetween={2}>
      <Text color={[[active, 'brand']]}>Heading</Text>
      <Stack
        axis={[['breakpoints.medium', 'x']]}
        spaceBetween={[
          ['default', 1],
          ['breakpoints.medium', 2],
        ]}
        as="button"
        onClick={() => alert('Hello World!')}
      >
        <Text>Content</Text>
      </Stack>
    </Stack>
  )
}
