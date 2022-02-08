import { useMemo } from 'react'
import { createGlobalStyle } from 'styled-components'
import { collectStyles } from 'system'

import '../app.css'

const GlobalStyles = createGlobalStyle<{ styles: any }>((props) => props.styles)

export default function App({ Component, pageProps }) {
  const variantStyles = useMemo(() => collectStyles(), [])
  console.log(variantStyles)
  return (
    <>
      <GlobalStyles styles={variantStyles} />
      <Component {...pageProps} />
    </>
  )
}
