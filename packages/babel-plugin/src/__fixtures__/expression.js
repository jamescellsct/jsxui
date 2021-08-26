import { Stack } from 'system'

export default function PagerView({ pages }) {
  const height = '100' + 'vh'
  return (
    <Stack axis="x" width={`${100 * pages.length}%`} height={height}>
      {pages}
    </Stack>
  )
}
