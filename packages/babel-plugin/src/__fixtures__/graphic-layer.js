function App() {
  return (
    <AnimateSharedLayout>
      {activeIndex >= 4 ? (
        <Graphic
          key="design-handoff-cluster"
          name="design-handoff-cluster"
          width="20vw"
        >
          <Layer name="discipline-1" layoutId="discipline-1" as={motion.g} />
          <Layer name="discipline-2" layoutId="discipline-2" as={motion.g} />
          <Layer name="discipline-3" layoutId="discipline-3" as={motion.g} />
        </Graphic>
      ) : (
        <Graphic
          key="design-handoff-linear"
          name="design-handoff-linear"
          width="48vw"
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
    </AnimateSharedLayout>
  )
}
