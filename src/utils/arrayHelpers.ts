export function oneOf<T extends readonly any[]>(
  values: T,
  item: any,
): item is T[number] {
  return values.includes(item)
}

export function hasAny<T>(ary: T[]): ary is [T, ...T[]]
export function hasAny<T>(ary: readonly T[]): ary is readonly [T, ...T[]]
export function hasAny<T>(ary: readonly T[]): ary is readonly [T, ...T[]] {
  return ary.length > 0
}
