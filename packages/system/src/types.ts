export type NoInfer<T> = T extends infer S ? S : never

export type Transform = (value: any) => Record<string, unknown>

export type TransformValue<
  Transform extends (value: any) => Record<string, unknown>
> = Parameters<Transform>[0]

export type TransformValues<T extends Record<string, Transform>> = {
  [K in keyof T]: TransformValue<T[K]>
}

export type ComplexValue<Props, Keys extends string | number | symbol> =
  | Props
  | ({ initial?: Props } & { [Key in Keys]?: Props })

export type ComplexProps<Props, StateKeys extends string | number | symbol> = {
  [Key in keyof Props]: ComplexValue<Props[Key], StateKeys>
}
