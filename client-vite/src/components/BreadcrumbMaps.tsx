import {FC} from "react"
import {useDispatch,} from "react-redux"
import { Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import {nodeApi, useOpenWorkspaceQuery} from "../apis/NodeApi"
import {AppDispatch} from "../reducers/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/NodeApiState"

export const BreadcrumbMaps: FC = () => {
  const { data } = useOpenWorkspaceQuery()
  const { frameId, breadcrumbMapIdList, breadcrumbMapNameList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <div className="_bg top-0 fixed left-1/2 -translate-x-1/2 h-[40px] flex items-center rounded-b-lg py-1 px-4 border-2 border-mb-pink border-t-0 z-50">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {
          breadcrumbMapNameList.map((el: { name: string }, index: number) => (
            <Link
              underline={frameId !== '' ? 'none': 'hover'} href="/"
              onClick={
                e => {
                  e.preventDefault()
                  frameId !== ''
                    ? console.log('prevent')
                    : dispatch(nodeApi.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[index], frameId: ''}))
                }
              }
              key={index}>
              {el.name}
            </Link>
          ))
        }
      </Breadcrumbs>
    </div>
  )
}
