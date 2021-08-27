import { Graphic } from '@jsxui/react'

export default function App() {
  return (
    <Graphic
      name="landing-page"
      width="100%"
      css={{
        transform: 'translate(50vw, -50%)',
        position: 'fixed',
        top: '50%',
        left: 0,
      }}
    />
  )
}
