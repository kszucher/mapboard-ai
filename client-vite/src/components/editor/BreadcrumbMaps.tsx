import {FC} from "react"
import {useDispatch,} from "react-redux"
import {nodeApi, useOpenWorkspaceQuery} from "../../apis/NodeApi"
import {AppDispatch} from "../../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../../state/NodeApiState"
import { Breadcrumb } from "flowbite-react"

export const BreadcrumbMaps: FC = () => {
  const { data } = useOpenWorkspaceQuery()
  const { frameId, breadcrumbMapIdList, breadcrumbMapNameList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="dark:bg-zinc-800 bg-zinc-50 top-0 fixed left-1/2 -translate-x-1/2 h-[40px] flex items-center rounded-b-lg py-1 px-4 border-2 border-purple-700 border-t-0 z-50">
      <Breadcrumb aria-label="Default breadcrumb example">
        {breadcrumbMapNameList.map((el, index) => (
          <Breadcrumb.Item
            href="/"
            onClick={e => {e.preventDefault(); frameId !== '' ? console.log('prevent') : dispatch(nodeApi.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[index], frameId: ''}))}}
            key={index}
          >
            {el.name}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
    </div>
  )
}
