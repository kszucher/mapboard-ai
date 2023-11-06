import React, {FC, useState} from "react"
import {useDispatch} from "react-redux"
import {actions, AppDispatch} from "../../reducers/EditorReducer"
import {PageState} from "../../state/Enums"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {defaultUseOpenWorkspaceQueryState, getMapId} from "../../state/NodeApiState"
import {Button, Label, Modal, TextInput} from "flowbite-react"

export const RenameMapModal: FC = () => {
  const { data } = useOpenWorkspaceQuery()
  const { tabMapNameList, tabId } = data || defaultUseOpenWorkspaceQueryState
  const [mapName, setMapName] = useState(tabMapNameList[tabId].name)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <Modal
      theme={{
        root: {
          show: {
            on: "flex bg-zinc-700 bg-opacity-25 dark:bg-opacity-40"
          }
        },
        content: {
          base: "top-[64px] relative h-full w-full p-4 md:h-auto",
          inner: "relative rounded-lg bg-white shadow dark:bg-zinc-800 flex flex-col max-h-[90vh]"
        }
      }}
      show={true}
      onClose={() => dispatch(actions.setPageState(PageState.WS))}
      position="top-center"
      size="lg"
    >
      <Modal.Header>Rename Map</Modal.Header>
      <Modal.Body>
        <div className="mb-2 block">
          <Label htmlFor="small" value="Map Name" />
        </div>
        <TextInput  type="text"  value={mapName} onChange={(e) => setMapName(e.target.value)} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => dispatch(nodeApi.endpoints.renameMap.initiate({mapId: getMapId(), name: mapName}))}>
          OK
        </Button>
        <Button color="gray" onClick={() => dispatch(actions.setPageState(PageState.WS))}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
