import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../../reducers/EditorReducer"
import {getG} from "../../selectors/MapQueries.ts"
import {mSelector} from "../../state/EditorState"
import {PlaceType} from "../../state/Enums.ts"
import {EyeIcon} from "../assets/Icons"

export const EditorMapViews = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" color="gray">
          <EyeIcon/>
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {getG(m).density === 'small' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'setDensityLarge', payload: null}))}>{'Set Density - Cozy'}</DropdownMenu.Item>}
        {getG(m).density === 'large' && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'setDensitySmall', payload: null}))}>{'Set Density - Compact'}</DropdownMenu.Item>}
        {getG(m).placeType === PlaceType.EXPLODED && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'setPlaceTypeIndented', payload: null}))}>{'Set PlaceType - Indented'}</DropdownMenu.Item>}
        {getG(m).placeType === PlaceType.INDENTED && <DropdownMenu.Item onClick={() => dispatch(actions.mapAction({type: 'setPlaceTypeExploded', payload: null}))}>{'Set PlaceType - Exploded'}</DropdownMenu.Item>}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
