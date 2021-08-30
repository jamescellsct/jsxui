import * as React from 'react'

export const ActiveSlideContext = React.createContext({
  active: null,
  setBackwardDisabled: null,
  setForwardDisabled: null,
})
export const useActiveSlide = () => React.useContext(ActiveSlideContext)
