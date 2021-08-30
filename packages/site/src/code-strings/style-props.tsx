export default function App() {
  return (
    <Stack as="figure" background="gray.100" cornerRadius="xl">
      <Image
        source="/react-finland.jpg"
        width="32px"
        height="32px"
        alt="React Finland Logo"
      />
      <Stack spaceYStart={6} spaceBetween={4}>
        <Stack as="blockquote">
          <Text size="large" weight="semibold">
            “React makes it painless to create interactive UIs.”
          </Text>
        </Stack>
        <Stack as="figcaption">
          <Text color="cyan.600">React</Text>
          <Text color="gray.500">
            A JavaScript library for building user interfaces
          </Text>
        </Stack>
      </Stack>
    </Stack>
  )
}
