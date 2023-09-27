import React, {FC, useState} from "react"
import {useDispatch, useSelector} from "react-redux"
import {actions, AppDispatch, RootState} from "../reducers/EditorReducer"
import {PageState} from "../state/Enums"
import {nodeApi, useOpenWorkspaceQuery} from "../apis/NodeApi"
import { mSelector} from "../state/EditorState"
import {defaultUseOpenWorkspaceQueryState, getMapId} from "../state/NodeApiState"

export const ModalRenameMap: FC = () => {
  const { data } = useOpenWorkspaceQuery()
  const { tabMapNameList, tabId } = data || defaultUseOpenWorkspaceQueryState
  const [mapName, setMapName] = useState(tabMapNameList[tabId].name)
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div id="defaultModal" tabIndex={-1} aria-hidden="true" className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full backdrop-brightness-75">
      <div className="relative top-20 left-1/2 -translate-x-1/2 w-full max-w-2xl max-h-full">
        {/* Modal content */}
        <div className="relative bg-white rounded-lg shadow dark:bg-zinc-800">
          {/* Modal header */}
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-zinc-600">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-white">
              Rename Map
            </h3>
            <button
              type="button"
              className="text-zinc-400 bg-transparent hover:bg-zinc-200 hover:text-zinc-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-zinc-600 dark:hover:text-white"
              data-modal-hide="defaultModal"
              onClick={() => dispatch(actions.setPageState(PageState.WS))}
            >

              <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-6 space-y-6">
            <div>
              <label htmlFor="map_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Map name</label>
              <input
                type="text"
                id="map_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                value={mapName}
                onChange={(e) => setMapName(e.target.value)}
                required />
            </div>
          </div>
          {/* Modal footer */}
          <div className="flex items-center p-6 space-x-2 border-t border-zinc-200 rounded-b dark:border-zinc-600">
            <button
              data-modal-hide="defaultModal"
              type="button"
              disabled={mapName.length < 2}
              className="disabled:opacity-20 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={() => dispatch(nodeApi.endpoints.renameMap.initiate({mapId: getMapId(), name: mapName}))}
            >{'OK'}</button>
            <button
              data-modal-hide="defaultModal"
              type="button"
              className="text-zinc-500 bg-white hover:bg-zinc-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-zinc-200 text-sm font-medium px-5 py-2.5 hover:text-zinc-900 focus:z-10 dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-500 dark:hover:text-white dark:hover:bg-zinc-600 dark:focus:ring-zinc-600"
              onClick={() => dispatch(actions.setPageState(PageState.WS))}
            >{"Cancel"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
