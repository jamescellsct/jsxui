import { Spacer, Stack } from 'system'

// user configuration for target environment so we don't have to always show
// both yarn and npm, possibly even allow choosing yarn version, pnpm, etc?
export function Header() {
  return (
    <Stack>
      <Spacer size={16} />
      <Stack axis="x">
        <Spacer size={16} />
        <Graphic name="logo" />
        <Spacer />
      </Stack>
      <Spacer size={16} />
    </Stack>
  )
}
