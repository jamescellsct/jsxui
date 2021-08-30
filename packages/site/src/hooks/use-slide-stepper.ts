import * as React from 'react'
import { useRovingIndex } from 'use-roving-index'

import { useActiveSlide } from '../components/ActiveSlideContext'

export function useSlideStepper({ maxIndex }) {
  const { active, setBackwardDisabled, setForwardDisabled } = useActiveSlide()
  const { activeIndex, moveBackward, moveForward } = useRovingIndex({
    maxIndex,
    contain: true,
  })

  // Quick hack to allow index progression to trigger slide states
  React.useEffect(() => {
    if (active) {
      setForwardDisabled(activeIndex < maxIndex)
      setBackwardDisabled(activeIndex > 0)
    }
    return () => {
      setForwardDisabled(false)
      setBackwardDisabled(false)
    }
  }, [active, activeIndex])

  React.useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'ArrowLeft') {
        moveBackward()
      }
      if (event.key === 'ArrowRight') {
        moveForward()
      }
    }
    if (active) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [active])

  return {
    activeIndex,
    moveBackward,
    moveForward,
  }
}
