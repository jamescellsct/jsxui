import styled from 'styled-components'
import { DebugSpace } from './DebugSpace'
import { createVariant } from '../system'

const spaceVariant = createVariant({
  transforms: {
    size: (value: number) => ({ height: `${value}rem` }),
    hidden: (value?: boolean) => ({ display: value ? 'none' : 'block' }),
  },
  variants: {},
})

export type SpaceStyleProps = {
  size?: number
  visible?: boolean
}

export type SpaceProps = SpaceStyleProps

const StyledSpace = styled.div<SpaceProps>({ position: 'relative' }, (props) =>
  spaceVariant.getStyleProps(props)
)

export const Space = (props: SpaceProps) => (
  <StyledSpace {...props}>
    <DebugSpace size={props.size} isMainAxisHorizontal={true} />
  </StyledSpace>
)
