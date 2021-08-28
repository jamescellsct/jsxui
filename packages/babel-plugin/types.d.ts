import * as React from 'react'

export type GraphicProps = {
  /** The name of the layer to render. Uses the first available layer if duplicates exist. */
  name: string

  /** The associated Figma file id found in the url or share link. */
  fileId?: string
} & React.SVGProps<SVGSVGElement>

declare global {
  /** Render an svg element from any Figma file. */
  function Graphic(props: GraphicProps): JSX.Element
}

export {}
