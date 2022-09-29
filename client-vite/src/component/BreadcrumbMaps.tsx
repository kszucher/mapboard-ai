import {FC} from "react";
import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import {sagaActions} from "../core/EditorFlow";

export const BreadcrumbMaps: FC = () => {
  const breadcrumbMapNameList = useSelector((state: RootStateOrAny) => state.breadcrumbMapNameList)
  const mapSource = useSelector((state: RootStateOrAny) => state.mapSource)
  const dispatch = useDispatch()
  return (
    <div className="_bg fixed left-1/2 -translate-x-1/2 h-[40px] flex items-center rounded-b-2xl py-1 px-4 border-2 border-mb-pink border-t-0">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        {
          breadcrumbMapNameList.map((el: string, index: number) => (
            <Link
              underline={mapSource === 'dataFrames' ? 'none': 'hover'} href="/"
              onClick={e => {
                e.preventDefault()
                mapSource === 'dataFrames' ? console.log('prevent') : dispatch(sagaActions.openMapFromBreadcrumbs(index))}
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
