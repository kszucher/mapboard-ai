import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer.ts"
import {getG} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState.ts"
import {Flow} from "../../state/Enums.ts"
import Eye from "../../assets/eye.svg?react"

export const MapViews = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray">
          <Eye/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {getG(m).density === 'small' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'setDensityLarge', payload: null}))}>{'Set Density - Cozy'}</DropdownMenu.Item>}
        {getG(m).density === 'large' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'setDensitySmall', payload: null}))}>{'Set Density - Compact'}</DropdownMenu.Item>}
        {getG(m).flow === Flow.EXPLODED && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'setPlaceTypeIndented', payload: null}))}>{'Set Flow - Indented'}</DropdownMenu.Item>}
        {getG(m).flow === Flow.INDENTED && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'setPlaceTypeExploded', payload: null}))}>{'Set Flow - Exploded'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
