export type ComplexValue<Props, Keys extends string | number | symbol> =
  | Props
  | ({ initial?: Props } & { [Key in Keys]?: Props })

export type ComplexProps<Props, StateKeys extends string | number | symbol> = {
  [Key in keyof Props]: ComplexValue<Props[Key], StateKeys>
}

export type MediaQueries = Record<string, unknown>

export type NoInfer<T> = T extends infer S ? S : never

export type Transform = (value: unknown) => Record<string, unknown>

export type TransformValue<T extends Transform> = Parameters<T>[0]

export type TransformValues<T extends Record<string, Transform>> = {
  [K in keyof T]: TransformValue<T[K]>
}
