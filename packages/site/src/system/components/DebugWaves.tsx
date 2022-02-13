export const DebugWaves = () => (
  <svg width="0" height="0" style={{ display: 'block' }}>
    <defs>
      <pattern
        id="horizontalWave"
        width="8"
        height="8"
        y="2"
        patternUnits="userSpaceOnUse"
      >
        <polyline
          points="0,0 4,4 8,0"
          fill="none"
          stroke="hotpink"
          strokeWidth="1"
        />
      </pattern>
      <pattern
        id="verticalWave"
        width="8"
        height="8"
        x="2"
        patternUnits="userSpaceOnUse"
      >
        <polyline
          points="0,0 4,4 0,8"
          fill="none"
          stroke="hotpink"
          strokeWidth="1"
        />
      </pattern>
      <pattern
        id="diagonalHatch"
        width="6"
        height="10"
        patternTransform="rotate(45 0 0)"
        patternUnits="userSpaceOnUse"
      >
        <line
          x1="0"
          y1="0"
          x2="0"
          y2="10"
          style={{ stroke: 'black', strokeWidth: 2 }}
        />
      </pattern>
    </defs>
  </svg>
)
