import * as React from 'react'
import { Spacer, Stack, Text } from 'system'
import { useRouter } from 'next/router'
import { useRovingIndex } from 'use-roving-index'
import { AnimateSharedLayout, motion } from 'framer-motion'

import {
  ActiveSlideContext,
  useActiveSlide,
} from '../components/ActiveSlideContext'
import { InOut } from '../components/InOut'
import { useSlideStepper } from '../hooks/use-slide-stepper'

import avatarSource from '../assets/avatar.jpeg'

// TODO: allow augmenting theme per file?
// export const theme = {
//   fontSizes: {
//     large: {
//       default: '128px',
//     },
//   },
// }

const slides = [
  Intro,
  DesignHandoff,
  Compilers,
  StaticAnalysis,
  StyleProps,
  CompilerComponents,
  Tokens,
  Transforms,
  Polymorphism,
  Variants,
  ComponentVariants,
  PropVariants,
  Assets,
  Platforms,
  BenefitsImplications,
  WhyThisIsImportant,
  OpenSource,
  WhatsNext,
  ThankYou,
]

export default function Presentation() {
  const [instant, setInstant] = React.useState(false)
  const [backwardDisabled, setBackwardDisabled] = React.useState(false)
  const [forwardDisabled, setForwardDisabled] = React.useState(false)
  const firstRender = React.useRef(true)
  const router = useRouter()
  const { activeIndex, setActiveIndex, moveBackward, moveForward } =
    useRovingIndex({
      maxIndex: slides.length - 1,
      contain: true,
    })

  // Add keyboard controls to navigate slides
  React.useEffect(() => {
    function handleKeyDown(event) {
      if (!backwardDisabled && event.key === 'ArrowLeft') {
        moveBackward()
      }
      if (!forwardDisabled && event.key === 'ArrowRight') {
        moveForward()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [backwardDisabled, forwardDisabled])

  // Move to slide according to URL slide param on mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const nextActiveIndex = params.get('slide')
    if (nextActiveIndex) {
      setActiveIndex(parseInt(nextActiveIndex, 10))
      setInstant(true)
    }
  }, [])

  // Push index changes to URL on change
  React.useEffect(() => {
    if (firstRender.current === false) {
      router.push(`?slide=${activeIndex}`)
    }
    firstRender.current = false
  }, [activeIndex])

  // Reset instant flag after one cycle
  React.useEffect(() => {
    if (instant) {
      setInstant(false)
    }
  }, [instant])

  return (
    <>
      <div css={{ overflow: 'hidden' }}>
        <Stack
          as={motion.div}
          axis="x"
          width={`${100 * slides.length}%`}
          animate={{
            transform: `translateX(${(activeIndex / slides.length) * -100}%)`,
          }}
          transition={
            instant
              ? {
                  type: 'linear',
                  duration: 0,
                }
              : {
                  type: 'spring',
                  duration: 0.5,
                  bounce: 0,
                }
          }
        >
          {slides.map((Slide, index) => (
            <ActiveSlideContext.Provider
              value={{
                active: index === activeIndex,
                setBackwardDisabled,
                setForwardDisabled,
              }}
            >
              <Slide key={index} />
            </ActiveSlideContext.Provider>
          ))}
        </Stack>
      </div>
      <Stack
        axis="x"
        spaceBetween="8px"
        css={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {slides.map((_, index) => (
          <Stack
            key={index}
            as="button"
            width={8}
            height={8}
            cornerRadius="50%"
            background={[
              ['default', 'brand'],
              [index === activeIndex, 'white'],
            ]}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </Stack>
    </>
  )
}

function Layout({
  axis,
  children,
}: {
  axis?: 'x' | 'y'
  children: React.ReactNode
}) {
  return (
    <Stack axis={axis} width="100vw" height="100vh" css={{ flex: '0 0 auto' }}>
      {children}
    </Stack>
  )
}

function Intro() {
  const active = useActiveSlide()
  const graphicOffset = { x: active ? '60vw' : '74vw' }
  return (
    <Layout>
      <motion.div
        initial={graphicOffset}
        animate={graphicOffset}
        style={{ y: '-50%' }}
        css={{
          position: 'fixed',
          top: '50%',
          left: 0,
        }}
      >
        <Graphic name="landing-page" height={900} />
      </motion.div>
      <Spacer />
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer />
          <Text width="720px" variant="heading1">
            JSX for Designers
          </Text>
          <Spacer size="64px" />
          <Stack axis="x">
            <Stack>
              <Spacer />
              <img
                src={avatarSource.src}
                alt="Picture of the author"
                width={120}
                height={120}
                css={{ borderRadius: '50%' }}
              />
              <Spacer />
            </Stack>
            <Spacer size="32px" />
            <Stack>
              <Spacer />
              <Text variant="body2" weight="bold" color="foreground">
                Travis Arnold
              </Text>
              <Spacer size="4px" />
              <Text variant="body2">Design Systems Frame.io</Text>
              <Text variant="body2">@souporserious</Text>
              <Spacer />
            </Stack>
          </Stack>
          <Spacer />
        </Stack>
        <Spacer />
      </Stack>
      <Spacer />
    </Layout>
  )
}

function DesignHandoff() {
  const { activeIndex } = useSlideStepper({ maxIndex: 4 })
  const initialArrowTranslateX = -40

  return (
    <AnimateSharedLayout>
      <Layout>
        <Spacer />
        <Stack axis="x">
          <Spacer size="96px" />
          <Stack>
            <Spacer />
            <Text width="720px" variant="heading1">
              Design Handoff
            </Text>
            <Spacer />
          </Stack>
          <Spacer size="32px" />
          {activeIndex >= 4 ? (
            <Graphic
              name="design-handoff-cluster"
              key="design-handoff-cluster"
              width="60vw"
            >
              <Layer
                name="discipline-1"
                layoutId="discipline-1"
                as={motion.g}
              />
              <Layer
                name="discipline-2"
                layoutId="discipline-2"
                as={motion.g}
              />
              <Layer
                name="discipline-3"
                layoutId="discipline-3"
                as={motion.g}
              />
            </Graphic>
          ) : (
            <Graphic
              name="design-handoff-linear"
              key="design-handoff-linear"
              width="60vw"
            >
              <Layer
                name="discipline-1"
                layoutId="discipline-1"
                as={motion.g}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex >= 1 ? 1 : 0 }}
              />
              <Layer
                name="arrow-1"
                as={motion.path}
                initial={{ opacity: 0, translateX: initialArrowTranslateX }}
                animate={{
                  opacity: activeIndex >= 2 ? 1 : 0,
                  translateX: activeIndex >= 2 ? 0 : initialArrowTranslateX,
                }}
              />
              <Layer
                name="discipline-2"
                layoutId="discipline-2"
                as={motion.g}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex >= 2 ? 1 : 0 }}
              />
              <Layer
                name="arrow-2"
                as={motion.path}
                initial={{ opacity: 0, translateX: initialArrowTranslateX }}
                animate={{
                  opacity: activeIndex >= 3 ? 1 : 0,
                  translateX: activeIndex >= 3 ? 0 : initialArrowTranslateX,
                }}
              />
              <Layer
                name="discipline-3"
                layoutId="discipline-3"
                as={motion.g}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex >= 3 ? 1 : 0 }}
              />
            </Graphic>
          )}
          <Spacer size="32px" />
        </Stack>
        <Spacer />
      </Layout>
    </AnimateSharedLayout>
  )
}

// @ts-ignore
import staticAnalysisCodeString from '!!raw-loader!../code-strings/static-analysis'
import { parse } from '@babel/parser'
import { ObjectInspector } from 'react-inspector'
import clean from 'clean-object'
import { theme } from '../utils/object-inspector-theme'
import nightOwlTheme from 'prism-react-renderer/themes/nightOwl'

function getAst(code) {
  const ast = parse(code, {
    sourceType: 'module',
    plugins: ['jsx'],
  })
  return clean(ast)
}

const ast = getAst(staticAnalysisCodeString)

function Compilers() {
  return (
    <Layout>
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer />
          <Text width="720px" variant="heading1">
            Compilers
          </Text>
          <Spacer />
        </Stack>
        <Spacer />
        <Stack
          width="50vw"
          height="100vh"
          background={nightOwlTheme.plain.backgroundColor}
        >
          <Spacer size="32px" />
          <Stack axis="x" css={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
            <Spacer size="32px" />
            <ObjectInspector theme={theme} data={ast} expandLevel={10} />
            <Spacer size="32px" />
          </Stack>
          <Spacer size="32px" />
        </Stack>
      </Stack>
    </Layout>
  )
}

import { SyntaxHighlighter } from '../components/SyntaxHighlighter'
import { getTree, renderTree } from '../utils/get-tree'

const initialActiveLayerState = {
  id: null,
  start: -1,
  end: -1,
}

const getLineLength = (position) => {
  return staticAnalysisCodeString.substr(0, position).split('\n').length
}

function StaticAnalysis() {
  const { activeIndex } = useSlideStepper({ maxIndex: 3 })
  const [activeLayer, setActiveLayer] = React.useState(initialActiveLayerState)
  const [tree, setTree] = React.useState({ name: null, children: [] })
  const renderedTree = renderTree(tree)

  React.useEffect(() => {
    getTree(staticAnalysisCodeString)
      .then(setTree)
      .catch((err) => null) // ignore errors for this simple demo
  }, [])

  React.useEffect(() => {
    // Skip initial index so we can move to it afterwards
    if (activeIndex > 0) {
      const item = renderedTree[activeIndex - 1]
      if (item) {
        const { name, start, end } = item
        const id = `${name}-${start}-${end}`
        setActiveLayer({
          id,
          start: getLineLength(start),
          end: getLineLength(end),
        })
      }
    }
  }, [activeIndex])

  return (
    <Layout>
      <Spacer />
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer />
          <Text width="720px" variant="heading1">
            Static Analysis
          </Text>
          <Spacer />
        </Stack>
        <Stack axis="x" height="100vh">
          <Stack width="240px">
            <Spacer />
            {renderedTree.map(({ name, start, end, depth }) => {
              const id = `${name}-${start}-${end}`
              return (
                <Stack
                  key={id}
                  axis="x"
                  background={[[id === activeLayer.id, '#5c31a0']]}
                  cornerRadius={8}
                  css={{ cursor: 'default' }}
                  onMouseEnter={() => {
                    setActiveLayer({
                      id,
                      start: getLineLength(start),
                      end: getLineLength(end),
                    })
                  }}
                  onMouseLeave={() => {
                    setActiveLayer(initialActiveLayerState)
                  }}
                >
                  <Spacer size={8 + depth * 32} />
                  <Stack>
                    <Spacer size={8} />
                    <Text size="small">{name}</Text>
                    <Spacer size={8} />
                  </Stack>
                  <Spacer size={8} />
                </Stack>
              )
            })}
            <Spacer />
          </Stack>
          <Spacer size="16px" />
          <Stack width="720px">
            <Spacer />
            <Stack>
              <SyntaxHighlighter
                codeString={staticAnalysisCodeString}
                metaString={`{${activeLayer.start}-${activeLayer.end}}`}
                printWidth={80}
              />
            </Stack>
            <Spacer size="24px" />
            <Stack axis="x">
              <Spacer />
              <Text>
                <Text weight="bold">Source:</Text>{' '}
                <Text
                  as="a"
                  href="https://souporserious.com/use-babel-to-statically-analyze-jsx/"
                >
                  souporserious.com/use-babel-to-statically-analyze-jsx/
                </Text>
              </Text>
              <Spacer />
            </Stack>
            <Spacer />
          </Stack>
        </Stack>
      </Stack>
    </Layout>
  )
}

// @ts-ignore
import stylePropsCodeString from '!!raw-loader!../code-strings/style-props'
import { LargeSyntaxHighlighter } from '../components/LargeSyntaxHighlighter'

function StyleProps() {
  return (
    <Layout>
      <Spacer />
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer />
          <Text width="720px" variant="heading1">
            Style Props
          </Text>
          <Spacer />
        </Stack>
        <Stack css={{ flexShrink: 0 }}>
          <LargeSyntaxHighlighter codeString={stylePropsCodeString} />
        </Stack>
      </Stack>
      <Spacer />
    </Layout>
  )
}

// @ts-ignore
import compilerComponentsCodeString from '!!raw-loader!../code-strings/compiler-components'

function CompilerComponents() {
  const { activeIndex } = useSlideStepper({ maxIndex: 7 })
  return (
    <Layout>
      <Spacer />
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer size="2fr" />
          <Text width="720px" variant="heading1">
            Compiler Components
          </Text>
          <Spacer />
          <Stack spaceBetween="48px">
            <Stack axis="x" spaceBetween="48px">
              <Text
                as={motion.span}
                size="medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex >= 1 ? 1 : 0 }}
              >
                Tokens
              </Text>
              <Text
                as={motion.span}
                size="medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex >= 2 ? 1 : 0 }}
              >
                Transforms
              </Text>
              <Text
                as={motion.span}
                size="medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex >= 3 ? 1 : 0 }}
              >
                Polymorphism
              </Text>
            </Stack>
            <Stack axis="x" spaceBetween="48px">
              <Text
                as={motion.span}
                size="medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex >= 4 ? 1 : 0 }}
              >
                Variants
              </Text>
              <Text
                as={motion.span}
                size="medium"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeIndex >= 5 ? 1 : 0,
                }}
              >
                Assets
              </Text>
              <Text
                as={motion.span}
                size="medium"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeIndex >= 7 ? 0.5 : activeIndex >= 6 ? 1 : 0,
                }}
              >
                Overrides
              </Text>
            </Stack>
          </Stack>
          <Spacer size="64px" />
        </Stack>
        <Spacer />
        <Stack>
          <SyntaxHighlighter
            codeString={compilerComponentsCodeString}
            fontSize="1.2em"
            showNumbers={false}
          />
        </Stack>
        <Spacer />
      </Stack>
      <Spacer />
    </Layout>
  )
}

const tokenString = `
<Stack space="large" background="brand" />
`

function Tokens() {
  return (
    <Layout>
      <Stack axis="x" height="100vh">
        <Stack axis="x">
          <Spacer size="96px" />
          <Stack>
            <Spacer />
            <Text width="720px" variant="heading1">
              Tokens
            </Text>
            <Spacer />
          </Stack>
        </Stack>
        <Spacer />
        <Stack>
          <Spacer />
          <InOut codeString={tokenString} />
          <Spacer />
        </Stack>
        <Spacer size="15vw" />
      </Stack>
    </Layout>
  )
}

const transformsString = `
const transforms = {
  width: (value) => ({
    width: theme.lineLengths[value] || value,
  }),
  size: (value) => {
    const systemFontSize = theme.fontSizes[value]
    return {
      fontSize: systemFontSize
        ? systemFontSize.default || systemFontSize
        : value,
    }
  },
  alignment: (value) => ({
    textAlign: value,
  }),
  opacity: (value) => ({
    opacity: value,
  }),
  shadow: (value) => ({
    filter: value,
  }),
  color: (value) => ({
    color: theme.colors[value] || value,
  }),
}
`

function Transforms() {
  return (
    <Layout>
      <Spacer />
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer />
          <Text width="720px" variant="heading1">
            Transforms
          </Text>
          <Spacer />
        </Stack>
        <Spacer size="16vw" />
        <Stack>
          <SyntaxHighlighter
            codeString={transformsString}
            showNumbers={false}
            fontSize="1.2em"
          />
        </Stack>
      </Stack>
      <Spacer />
    </Layout>
  )
}

const polymorphismString = `
<Stack as="button" onClick={() => send({ type: 'FETCH_DOG' })} />
`

function Polymorphism() {
  return (
    <Layout>
      <Stack axis="x" height="100vh">
        <Stack axis="x">
          <Spacer size="96px" />
          <Stack>
            <Spacer />
            <Text variant="heading1" size="96px">
              Polymorphism
            </Text>
            <Spacer />
          </Stack>
        </Stack>
        <Spacer />
        <InOut codeString={polymorphismString} />
        <Spacer size="64px" />
      </Stack>
    </Layout>
  )
}

const variantsString = `
const variants = {
  heading1: {
    defaults: {
      size: 'xlarge',
    },
    web: {
      as: 'h1',
    },
    native: {
      as: 'Text',
      accessibilityRole: 'header',
    },
  },
  body1: {
    defaults: {
      size: 'medium',
      letterSpacing: 0.8,
    },
    web: {
      as: 'p',
    },
    native: {
      as: 'Text',
    },
  },
}
`

function Variants() {
  return (
    <Layout>
      <Stack axis="x" height="100vh">
        <Stack axis="x">
          <Spacer size="96px" />
          <Stack>
            <Spacer />
            <Text width="720px" variant="heading1">
              Variants
            </Text>
            <Spacer />
          </Stack>
        </Stack>
        <Spacer size="20vw" />
        <Stack>
          <Spacer />
          <SyntaxHighlighter
            codeString={variantsString}
            showNumbers={false}
            fontSize="1.2em"
          />
          <Spacer />
        </Stack>
      </Stack>
    </Layout>
  )
}

const componentVariantsString = `
<Text variant="heading3">
  The Future Is Compiled
</Text>
`

function ComponentVariants() {
  return (
    <Layout>
      <Stack axis="x" height="100vh">
        <Stack axis="x">
          <Spacer size="96px" />
          <Stack>
            <Spacer />
            <Text variant="heading1">Component Variants</Text>
            <Spacer />
          </Stack>
        </Stack>
        <Spacer />
        <InOut codeString={componentVariantsString} />
        <Spacer size="120px" />
      </Stack>
    </Layout>
  )
}

const propVariantsStringOne = `
<Text size={[['default', 'medium'],['breakpoints.large', 'large']]} />
`

const propVariantsStringTwo = `
function Button({ active }) {
  return <Stack as="button" background={[['default', 'surface'], [active, 'brand']]} />
}
`

function PropVariants() {
  const { activeIndex } = useSlideStepper({ maxIndex: 1 })
  return (
    <Layout>
      <Stack axis="x" height="100vh">
        <Stack axis="x" css={{ flexBasis: '800px' }}>
          <Spacer size="96px" />
          <Stack>
            <Spacer />
            <Text variant="heading1">Prop Variants</Text>
            <Spacer />
          </Stack>
        </Stack>
        <Spacer size="64px" />
        <InOut
          codeString={
            activeIndex > 0 ? propVariantsStringTwo : propVariantsStringOne
          }
        />
      </Stack>
    </Layout>
  )
}

const graphicCodeStringIn = `
<Graphic name="design-handoff-linear" width="48vw" />
`
const graphicCodeStringOut = `
<svg
  height="700"
  fill="none"
  viewBox="0 0 1625 700"
  width="48vw"
>
  <g id="design-handoff-linear">
    <path
      id="arrow-2"
      d="M1189 383L1114 339.699L1114 426.301L1189..."
      fill="#CBABFE"
    />
    ...
  </g>
</svg>
`
const layerCodeStringIn = `
<Graphic
  name="design-handoff-cluster"
  width="20vw"
>
  <Layer name="discipline-1" layoutId="discipline-1" as={motion.g} />
  ...
</Graphic>
`
const layerCodeStringOut = `
<svg height="736" fill="none" viewBox="0 0 1625 736" width="20vw">
  <motion.g layoutId="discipline-1">
    <path
      d="M466 210C466 99.5431 555.543 10 666..."
      fill="white"
    />
    ...
  </motion.g>
</svg>
`

function Assets() {
  const { activeIndex } = useSlideStepper({ maxIndex: 1 })
  return (
    <Layout>
      <Stack axis="x" height="100vh">
        <Stack axis="x" css={{ flexBasis: '800px' }}>
          <Spacer size="96px" />
          <Stack>
            <Spacer />
            <Text variant="heading1">Assets</Text>
            <Spacer />
          </Stack>
        </Stack>
        <Spacer size="64px" />
        <InOut
          codeString={activeIndex > 0 ? layerCodeStringIn : graphicCodeStringIn}
          codeStringOut={
            activeIndex > 0 ? layerCodeStringOut : graphicCodeStringOut
          }
        />
      </Stack>
    </Layout>
  )
}

const platformCodeString = `
const figmaVisitor = {
  JSXElement(path, state) {
    path.node.openingElement.attributes.push(
      t.jsxAttribute(
        t.jsxIdentifier('style'),
        t.jsxExpressionContainer(t.objectExpression(state.styleProperties))
      )
    )
  },
}

const inkVisitor = {
  JSXElement(path, state) {
    path.node.openingElement.attributes =
      path.node.openingElement.attributes.concat(state.styleAttributes)
  },
}
`

function Platforms() {
  return (
    <Layout>
      <Spacer />
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer />
          <Text variant="heading1">Platforms</Text>
          <Spacer />
        </Stack>
        <Spacer />
        <SyntaxHighlighter
          codeString={platformCodeString}
          showNumbers={false}
          fontSize="1.2em"
        />
        <Spacer />
      </Stack>
      <Spacer />
    </Layout>
  )
}

function BenefitsImplications() {
  const { activeIndex } = useSlideStepper({ maxIndex: 10 })
  return (
    <Layout>
      <Spacer size={240} />
      <Stack axis="x">
        <Spacer />
        <Stack spaceBetween={120}>
          <Text
            as={motion.span}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeIndex > 0 ? 1 : 0 }}
            variant="heading2"
          >
            Benefits
          </Text>
          <Stack spaceBetween={40}>
            {[
              'Design Systems',
              'Cross-Platform',
              'Implementation Agnostic',
              'Reports / Linting',
              'Best-In-Class DX/UX',
            ].map((content, index) => (
              <Text
                key={content}
                as={motion.span}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex > index + 1 ? 1 : 0 }}
                variant="body1"
              >
                {content}
              </Text>
            ))}
          </Stack>
        </Stack>
        <Spacer />
        <Stack spaceBetween={120}>
          <Text
            as={motion.span}
            initial={{ opacity: 0 }}
            animate={{ opacity: activeIndex > 6 ? 1 : 0 }}
            variant="heading2"
          >
            Implications
          </Text>
          <Stack spaceBetween={40}>
            {[
              'Not everything can be compiled',
              'Harder to debug',
              'Existing systems',
            ].map((content, index) => (
              <Text
                key={content}
                as={motion.span}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeIndex > index + 7 ? 1 : 0 }}
                variant="body1"
              >
                {content}
              </Text>
            ))}
          </Stack>
        </Stack>
        <Spacer />
      </Stack>
      <Spacer />
    </Layout>
  )
}

function WhyThisIsImportant() {
  const reasons = [
    'Offers consistency',
    'Focus on better tasks',
    'Fully declarative',
    <>
      <Text
        as="a"
        href="https://blog.codinghorror.com/falling-into-the-pit-of-success/"
        css={{ color: 'white' }}
      >
        Pit of success
      </Text>{' '}
      for all
    </>,
  ]
  const { activeIndex } = useSlideStepper({ maxIndex: reasons.length })
  return (
    <Layout>
      <Spacer />
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer />
          <Text width="800px" variant="heading1">
            Why Is This Important
          </Text>
          <Spacer />
        </Stack>
        <Spacer />
        <Stack spaceBetween={40}>
          {reasons.map((content, index) => (
            <Text
              key={content}
              as={motion.span}
              initial={{ opacity: 0 }}
              animate={{ opacity: activeIndex > index ? 1 : 0 }}
              variant="body1"
            >
              {content}
            </Text>
          ))}
        </Stack>
        <Spacer />
      </Stack>
      <Spacer />
    </Layout>
  )
}

function OpenSource() {
  return (
    <Layout>
      <Spacer />
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer />
          <Text width="600px" variant="heading1">
            Open Source
          </Text>
          <Spacer />
        </Stack>
        <Spacer size="148px" />
        <div
          css={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridGap: 160,
          }}
        >
          {[
            'Glamor',
            'JSXStyle',
            'BlocksUI',
            'React Primitives',
            'Rebass',
            'ThemeUI',
          ].map((content) => (
            <Text key={content} variant="body1" alignment="center">
              {content}
            </Text>
          ))}
        </div>
      </Stack>
      <Spacer />
    </Layout>
  )
}

function WhatsNext() {
  return (
    <Layout axis="x">
      <Spacer size="120px" />
      <Stack>
        <Spacer />
        <Text variant="heading1">What's Next?</Text>
        <Spacer />
      </Stack>
      <Spacer size="300px" />
      <Stack>
        <Spacer />
        <Graphic name="whats-next" width="80%" />
        <Spacer />
      </Stack>
      <Spacer />
    </Layout>
  )
}

function ThankYou() {
  return (
    <Layout>
      <Spacer />
      <Stack axis="x">
        <Spacer size="96px" />
        <Stack>
          <Spacer />
          <Text width="720px" variant="heading1">
            Thank You
          </Text>
          <Spacer />
        </Stack>
        <Spacer />
        <Stack>
          <Spacer />
          <Text alignment="center" variant="body1" size="80px">
            www.jsxui.com
          </Text>
          <Spacer size="48px" />
          <Text alignment="center" variant="body1" size="80px">
            @souporserious
          </Text>
          <Spacer />
        </Stack>
        <Spacer />
      </Stack>
      <Spacer />
    </Layout>
  )
}
