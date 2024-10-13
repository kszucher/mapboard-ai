import {DropdownMenu, IconButton} from "@radix-ui/themes"
import {useDispatch, useSelector} from "react-redux"
import Dots from "../../assets/dots.svg?react"
import {actions} from "../editorMutations/EditorMutations.ts"
import {mSelector} from "../editorQueries/EditorQueries.ts"
import {NodeMode} from "../editorState/EditorStateTypesEnums.ts"
import {getNodeMode, getXR} from "../mapQueries/MapQueries.ts"
import {ControlType} from "../mapState/MapStateTypesEnums.ts"
import {AppDispatch, RootState} from "../rootComponent/RootComponent.tsx"

export const NodeActions = () => {
  const m = useSelector((state:RootState) => mSelector(state))
  const nodeMode = getNodeMode(m)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={nodeMode === NodeMode.VIEW}>
        <IconButton variant="solid" color="gray">
          <Dots/>
        </IconButton>
      </DropdownMenu.Trigger>
      {nodeMode === NodeMode.EDIT_ROOT &&
        <DropdownMenu.Content onCloseAutoFocus={e => e.preventDefault()}>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              {'Select'}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => dispatch(actions.selectRA())}>
                {'All Root'}
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              {'Insert'}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => dispatch(actions.insertR())}>
                {'Root Out'}
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              {'Move'}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              {'Edit'}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              {getXR(m).controlType !== ControlType.NONE &&
                <DropdownMenu.Item onClick={() => dispatch(actions.setControlTypeNone())}>
                  {'Control Type None'}
                </DropdownMenu.Item>}
              {getXR(m).controlType !== ControlType.INGESTION &&
                <DropdownMenu.Item onClick={() => dispatch(actions.setControlTypeIngestion())}>
                  {'Control Type Ingestion'}
                </DropdownMenu.Item>}
              {getXR(m).controlType !== ControlType.EXTRACTION &&
                <DropdownMenu.Item onClick={() => dispatch(actions.setControlTypeExtraction())}>
                  {'Control Type Extraction'}
                </DropdownMenu.Item>}
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
        </DropdownMenu.Content>
      }
    </DropdownMenu.Root>
  )
}
