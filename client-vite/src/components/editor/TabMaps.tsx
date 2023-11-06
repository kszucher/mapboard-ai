import React, {FC} from "react"
import {useDispatch} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AppDispatch} from "../../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"

export const TabMaps: FC = () => {
  const { data } = useOpenWorkspaceQuery()
  const { tabMapIdList, tabMapNameList, tabId } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="fixed z-50 w-[224px] top-[80px] dark:bg-zinc-800 bg-zinc-50 border-l-0 border-2 dark:border-neutral-700 pt-4 rounded-r-lg">
      <h4 id="sidebar-label" className="sr-only">Browse docs</h4>
      <div id="navWrapper" className="overflow-y-auto z-50 h-full bg-white scrolling-touch max-w-2xs lg:h-[calc(100vh-3rem)] lg:block lg:sticky top:24 lg:top-28 dark:bg-zinc-800 lg:mr-0">
        <nav id="nav" className="ml-4 pt-16 px-1 pl-3 lg:pl-0 lg:pt-2 font-normal text-base lg:text-sm pb-10 lg:pb-20 sticky?lg:h-(screen-18)" aria-label="Docs navigation">
          <ul className="mb-0 list-unstyled">
            <li>
              <h5 className="mb-2 text-sm font-semibold tracking-wide text-gray-900 uppercase lg:text-xs dark:text-white">Maps</h5>
              <ul className="py-1 list-unstyled fw-normal small">
                {tabMapNameList.map((el: { name: string }, index) => (
                  <li key={index}>
                    <a
                      style={{color: tabId === index ? '#ffffff': '', backgroundColor: tabId === index ? '#666666': ''}}
                      data-sidebar-item=""
                      className="rounded hover:bg-purple-700 cursor-pointer py-1 px-1 transition-colors relative flex items-center flex-wrap font-medium hover:text-gray-900 text-gray-500 dark:text-gray-400 dark:hover:text-white"
                      onClick={() => {dispatch(nodeApi.endpoints.selectMap.initiate({mapId: tabMapIdList[index], frameId: ''}))}}
                    >{el.name}
                    </a>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-8">
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
