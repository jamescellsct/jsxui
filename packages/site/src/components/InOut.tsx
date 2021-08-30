import * as React from 'react'
import { Spacer, Stack, Text } from 'system'
import { AnimateSharedLayout, motion } from 'framer-motion'

import { compile } from '../utils/compile'
import { format } from '../utils/format'
import { SyntaxHighlighter } from './SyntaxHighlighter'

export function InOut({ codeString, codeStringOut }) {
  return (
    <Stack css={{ flexShrink: 0 }}>
      <Spacer />
      <div
        css={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gridColumnGap: '48px',
          gridRowGap: '64px',
        }}
      >
        <Text
          as={motion.span}
          layoutId="in"
          layout="position"
          variant="heading2"
          alignment="end"
          css={{ gridArea: '1 / 1' }}
        >
          In
        </Text>
        <SyntaxHighlighter
          codeString={format(codeString)}
          showNumbers={false}
          fontSize="1.4em"
          css={{ gridArea: '1 / 2' }}
        />
        <Text
          as={motion.span}
          layoutId="out"
          layout="position"
          variant="heading2"
          alignment="end"
          css={{ gridArea: '2 / 1' }}
        >
          Out
        </Text>
        <SyntaxHighlighter
          codeString={
            codeStringOut ? format(codeStringOut) : compile(codeString)
          }
          showNumbers={false}
          fontSize="1.4em"
          css={{ gridArea: '2 / 2' }}
        />
      </div>
      <Spacer />
    </Stack>
  )
}
