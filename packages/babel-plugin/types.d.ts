import * as React from 'react'

export type GraphicProps = {
  /** The name of the layer to render. Uses the first available layer if duplicates exist. */
  name: string

  /** The associated Figma file id found in the url or share link. */
  fileId?: string
} & React.SVGProps<SVGSVGElement>

export type LayerProps = {
  /** The name of the layer to alter. Uses the first available layer if duplicates exist. */
  name: string

  /** Change the underlying element that is rendered. */
  as: any
} & React.SVGProps<SVGSVGElement>

declare global {
  /** Render an svg element from any Figma file. */
  function Graphic(props: GraphicProps): JSX.Element

  /** Render an svg element from any Figma file. */
  function Layer(props: LayerProps): JSX.Element
}

declare module '@jsxui/babel-plugin/dist/create-component' {
  export function createComponent<T>(config: any): {
    (props: T & { as?: any; variant?: string }): React.DetailedReactHTMLElement<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >
    displayName: any
    config: any
  }
}

export {}
