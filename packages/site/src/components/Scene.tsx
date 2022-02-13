import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { createVariant } from 'system'

const boxVariant = createVariant({
  states: ['activated', 'hovered', 'pressed'],
  transforms: {},
  variants: {},
})

function Box(props) {
  const ref = useRef(null)
  const [activated, activate] = useState(false)
  const [hovered, hover] = useState(false)
  const [pressed, press] = useState(false)
  const { color, ...meshProps } = boxVariant.getStateProps(props, {
    activated,
    hovered,
    pressed,
  })

  useFrame(() => (ref.current.rotation.x += 0.01))

  return (
    <mesh
      ref={ref}
      onClick={() => activate(!activated)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
      onPointerDown={() => press(true)}
      onPointerUp={() => press(false)}
      {...meshProps}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

export default function App() {
  return (
    <Canvas style={{ width: 500, height: 500 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box
        color={{ initial: 'orange', hovered: 'hotpink' }}
        scale={{ initial: 1, pressed: 1.5 }}
      />
      <OrbitControls />
    </Canvas>
  )
}
