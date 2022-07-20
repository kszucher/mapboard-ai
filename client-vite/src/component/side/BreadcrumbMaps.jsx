import {useSelector, useDispatch} from "react-redux";
import { Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function BreadcrumbMaps() {
    const breadcrumbMapNameList = useSelector(state => state.breadcrumbMapNameList)
    const mapSource = useSelector(state => state.mapSource)
    const dispatch = useDispatch()
    const openMapFromBreadcrumbs = index => dispatch({type: 'OPEN_MAP_FROM_BREADCRUMBS', payload: {breadcrumbMapSelected: index}})
    return (
        <div id="breadcrumb-maps">
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbMapNameList.map((el, index) => (
                    <Link
                        underline={mapSource === 'dataFrames' ? 'none': 'hover'}
                        href="/"
                        onClick={
                            e => {
                                e.preventDefault()
                                mapSource === 'dataFrames'
                                    ? console.log('prevent')
                                    : openMapFromBreadcrumbs(index)
                            }
                        }
                        key={index}>
                        {el}
                    </Link>
                ))}>
            </Breadcrumbs>
        </div>
    )
}
