import {FC} from "react";
import {useDispatch} from "react-redux";
import { Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {api, useOpenMapQuery} from "../core/Api";
import {defaultUseOpenMapQueryState} from "../core/EditorFlow";

export const BreadcrumbMaps: FC = () => {
  const { data, isFetching } = useOpenMapQuery()
  const { mapSource, breadcrumbMapIdList, breadcrumbMapNameList } = data?.resp?.data || defaultUseOpenMapQueryState
  const dispatch = useDispatch()
  return (
    <div className="_bg fixed left-1/2 -translate-x-1/2 h-[40px] flex items-center rounded-b-2xl py-1 px-4 border-2 border-mb-pink border-t-0">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {
          breadcrumbMapNameList.map((el: string, index: number) => (
            <Link
              underline={mapSource === 'dataFrames' ? 'none': 'hover'} href="/"
              onClick={
                e => {
                  e.preventDefault()
                  mapSource === 'dataFrames'
                    ? console.log('prevent')
                    : dispatch(api.endpoints.selectMapFromBreadcrumbs.initiate({mapId: breadcrumbMapIdList[index]}))
                }
              }
              key={index}>
              {el}
            </Link>
          ))
        }
      </Breadcrumbs>
    </div>
  )
}
