import { Stack } from 'system'
import { Header } from '@/components/Header'

export function Layout({ children }) {
  return (
    <Stack>
      <Header />
      <Stack axis="x">{children}</Stack>
    </Stack>
  )
}
