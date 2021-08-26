import { Stack, Text } from 'system'
import { motion } from 'framer-motion'

export default function App() {
  return (
    <Stack as={motion.div} initial={{ x: 0 }} animate={{ x: 100 }}>
      <Text>Hello World</Text>
    </Stack>
  )
}
