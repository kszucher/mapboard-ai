import {FC} from "react";
import {useDispatch} from "react-redux";
import { Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {api, useOpenMapQuery} from "../core/Api";

export const BreadcrumbMaps: FC = () => {
  // TODO
  // 1 implement openMapInMap so we can check if openmapbread works
  // 2 start using the normal HOOK-type mutation declaration everywhere, and replace the saga calls
  // 3 implement the api call and functionality one-by-one everywhere
  // HAPPYNESS = no saga, but AUTH introduced, and we have SESSIONS properly used and handles

  const { data, isFetching } = useOpenMapQuery(null, {skip: false})
  const { breadcrumbMapIdList, breadcrumbMapNameList, mapSource } = data?.resp?.data
  || { breadcrumbMapIdList: [], breadcrumbMapNameList: [], mapSource: ''}
  const dispatch = useDispatch()
  return (
    <>
      {!isFetching &&
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
      }
    </>
  )
}
