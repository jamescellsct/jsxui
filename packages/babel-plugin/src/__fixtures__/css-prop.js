import { Text } from 'system'

// TODO: process all props and try to replace system values?
export default function App() {
  return (
    <Text color="brand" css={{ ':hover': { color: 'pink' } }}>
      Hello World
    </Text>
  )
}
