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
    <div className="dark:bg-zinc-800 bg-zinc-50 top-0 fixed left-1/2 -translate-x-1/2 h-[40px] flex items-center rounded-b-lg py-1 px-4 border-2 border-purple-700 border-t-0 z-50">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {
          breadcrumbMapNameList.map((el, index) => (
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
      {/*<nav className="flex" aria-label="Breadcrumb">*/}
      {/*  <ol className="inline-flex items-center space-x-1 md:space-x-3">*/}
      {/*    <li className="inline-flex items-center">*/}
      {/*      <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">*/}
      {/*        Home*/}
      {/*      </a>*/}
      {/*    </li>*/}
      {/*    <li>*/}
      {/*      <div className="flex items-center">*/}
      {/*        <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">*/}
      {/*          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>*/}
      {/*        <a href="#" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white">*/}
      {/*          Projects*/}
      {/*        </a>*/}
      {/*      </div>*/}
      {/*    </li>*/}
      {/*    <li aria-current="page">*/}
      {/*      <div className="flex items-center">*/}
      {/*        <svg className="w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">*/}
      {/*          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>*/}
      {/*        </svg>*/}
      {/*        <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">*/}
      {/*          Flowbite*/}
      {/*        </span>*/}
      {/*      </div>*/}
      {/*    </li>*/}
      {/*  </ol>*/}
      {/*</nav>*/}
    </div>
  )
}
