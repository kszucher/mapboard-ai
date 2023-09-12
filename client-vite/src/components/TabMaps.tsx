import React, {FC} from "react"
import {useSelector, useDispatch} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../apis/NodeApi"
import {AppDispatch, RootState} from "../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"

export const TabMaps: FC = () => {
  const tabShrink = useSelector((state: RootState) => state.editor.tabShrink)
  const { data } = useOpenWorkspaceQuery()
  const { frameId, tabMapIdList, tabMapNameList, tabId } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <>
      {!tabShrink &&
        <div className="_bg fixed top-[80px] border-l-0 pt-4 pb-4 z-50" style={{width: 224, borderTopRightRadius: 8, borderBottomRightRadius: 8}}>
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
                          className="rounded hover:bg-violet-700 cursor-pointer py-1 px-1 transition-colors relative flex items-center flex-wrap font-medium hover:text-gray-900 text-gray-500 dark:text-gray-400 dark:hover:text-white "
                          onClick={() => {
                            dispatch(nodeApi.endpoints.selectMap.initiate({mapId: tabMapIdList[index], frameId: ''}))
                          }}
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
      }
    </>
  )
}
