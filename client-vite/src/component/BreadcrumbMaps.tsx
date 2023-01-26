import {FC} from "react";
import {RootStateOrAny, useDispatch, useSelector} from "react-redux";
import { Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {api, useOpenWorkspaceQuery} from "../core/Api";
import {defaultUseOpenWorkspaceQueryState} from "../core/EditorFlow";
import {PageState} from "../core/Types";

export const BreadcrumbMaps: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const { data, isFetching } = useOpenWorkspaceQuery(undefined, { skip:  pageState === PageState.AUTH  })
  const { dataFrameSelected, breadcrumbMapIdList, breadcrumbMapNameList } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch()
  return (
    <div className="_bg fixed left-1/2 -translate-x-1/2 h-[40px] flex items-center rounded-b-2xl py-1 px-4 border-2 border-mb-pink border-t-0">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {
          breadcrumbMapNameList.map((el: { name: string }, index: number) => (
            <Link
              underline={dataFrameSelected > -1 ? 'none': 'hover'} href="/"
              onClick={
                e => {
                  e.preventDefault()
                  dataFrameSelected > -1
                    ? console.log('prevent')
                    : dispatch(api.endpoints.selectMap.initiate({mapId: breadcrumbMapIdList[index]}))
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
