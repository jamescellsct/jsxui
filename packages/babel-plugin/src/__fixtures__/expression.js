import { Spacer, Stack } from 'system'

export default function PagerView({ pages }) {
  const height = '100' + 'vh'
  return (
    <Stack
      as={motion.div}
      axis="x"
      width={`${100 * slides.length}%`}
      // background="linear-gradient(162.02deg, #8B57DF 15.17%, #5D4387 87.41%);"
      animate={{
        transform: `translateX(${(activeIndex / slides.length) * -100}%)`,
        transition: instant
          ? {
              type: 'linear',
              duration: 0,
            }
          : {
              type: 'spring',
              damping: 50,
              stiffness: 400,
            },
      }}
    >
      {slides.map((Slide, index) => (
        <Slide key={index} />
      ))}
    </Stack>
  )
}
