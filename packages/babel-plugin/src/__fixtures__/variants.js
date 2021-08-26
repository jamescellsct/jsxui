import { Spacer, Stack, Text } from 'system'

export default function App({ active }) {
  return (
    <Stack spaceBetween={2}>
      <Text
        variant="heading1"
        color={[
          ['default', 'pink'],
          [active, 'brand'],
        ]}
      >
        Heading
      </Text>
      <Spacer
        size={[
          ['default', '4px'],
          ['breakpoints.medium', '16px'],
          ['breakpoints.large', '32px'],
        ]}
      />
      <Stack
        as="button"
        axis={[['breakpoints.medium', 'x']]}
        spaceBetween={[
          ['default', 1],
          ['breakpoints.medium', 2],
        ]}
        onClick={() => alert('Hello World!')}
      >
        <Text>Content</Text>
      </Stack>
    </Stack>
  )
}
