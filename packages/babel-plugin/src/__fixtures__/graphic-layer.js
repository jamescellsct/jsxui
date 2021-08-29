import { motion } from 'framer-motion'

export default function App() {
  return (
    <Graphic name="design-handoff" width="48vw">
      <Layer name="discipline-1" as={motion.g} animate={{ x: 100 }} />
      <Layer name="discipline-2" as={motion.g} animate={{ x: 200 }} />
      <Layer name="discipline-3" as={motion.g} animate={{ x: 300 }} />
    </Graphic>
  )
}
