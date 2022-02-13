export type ComplexValue<Props, Keys extends string | number | symbol> =
  | Props
  | ({ initial?: Props } & { [Key in Keys]?: Props })

export type ComplexProps<Props, StateKeys extends string | number | symbol> = {
  [Key in keyof Props]: ComplexValue<Props[Key], StateKeys>
}

export type MediaQueries = Record<string, unknown>

export type NoInfer<T> = T extends infer S ? S : never

export type Transform = (value: any) => unknown

export type TransformValue<T extends Transform> = Parameters<T>[0]

export type TransformValues<T extends Record<string, Transform>> = {
  [K in keyof T]: TransformValue<T[K]>
}

// type AssignOptionality<T extends Record<string, [boolean, any]>> = {
//   [K in keyof T as T[K][0] extends true ? K : never]?: T[K][1]
// } &
//   { [K in keyof T as T[K][0] extends false ? K : never]: T[K][1] }

// type WrapWithInfo<T> = [undefined extends T ? true : false, T]

// export type TransformValues<T extends Record<string, Transform>> =
//   AssignOptionality<{ [K in keyof T]: WrapWithInfo<TransformValue<T[K]>> }>
