import React from 'react'
import { Text, Spacer, Stack } from '@jsxui/react'

import { Github, Logo, Shapes, Wave } from '../assets'

export default function Index() {
  return (
    <Stack height="minmax(100vh, auto)">
      <div style={{ display: 'grid' }}>
        <Stack style={{ gridArea: '1 / 1' }}>
          <Shapes
            visible={{ default: false, 'breakpoints.large': true }}
            width="100%"
          />
        </Stack>
        <Stack
          axis="x"
          spaceX="minmax(16px, 1fr)"
          style={{ gridArea: '1 / 1' }}
        >
          <Stack
            width="minmax(auto, 960px)"
            spaceX="1fr"
            spaceYStart="16px"
            spaceYEnd="minmax(16px, 1fr)"
          >
            <Stack
              axis="x"
              width="1fr"
              spaceY="1fr"
              spaceBefore={0}
              spaceAfter={0}
            >
              <Logo width="auto" height="32px" />
              <Spacer />
              <Stack as="a" href="https://github.com/souporserious/jsxui">
                <Github />
              </Stack>
            </Stack>
            <Spacer size="80px" />
            <Text
              width="1fr"
              size="xlarge"
              weight="bold"
              lineSpacing={24}
              alignment="center"
              spaceBefore={{
                default: 0,
                'breakpoints.medium': 60,
              }}
              spaceAfter={{
                default: 0,
                'breakpoints.medium': 60,
              }}
            >
              Simple UI Primitives to Help Launch Your next&nbsp;Idea
            </Text>
            <Spacer
              size={{
                default: '32px',
                'breakpoints.medium': '48px',
              }}
            />
          </Stack>
        </Stack>
      </div>
      <Stack
        axis="x"
        width="minmax(100%, 1440px)"
        spaceX={{ 'breakpoints.large': '1fr' }}
        spaceBetween={{ 'breakpoints.large': 'minmax(24px, 0.5fr)' }}
        spaceYStart="40px"
        spaceYEnd="80px"
        // background={{ xray: 'url(#diagonalHatch)' }}
        // TODO: add X/YWrap components
        style={{ flexWrap: 'wrap' }}
      >
        {['Elements', 'Variants', 'Overrides', 'Editor'].map((name) => (
          <Stack
            key={name}
            width={{
              default: '50%',
              'breakpoints.large': '1fr',
            }}
            spaceX="1fr"
            spaceBetween="24px"
          >
            <Text
              size="large"
              weight="medium"
              alignment="center"
              opacity={0.75}
            >
              {name}
            </Text>
            <Text>Coming Soon</Text>
          </Stack>
        ))}
      </Stack>
      <Wave width="1fr" height="auto" />
      <Spacer size="minmax(80px, 1fr)" background="#7B5AD9" />
    </Stack>
  )
}
