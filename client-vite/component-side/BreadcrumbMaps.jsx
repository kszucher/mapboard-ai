import {useSelector, useDispatch} from "react-redux";
import { Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { getColors } from '../core/Colors'

export default function BreadcrumbMaps() {
    const colorMode = useSelector(state => state.colorMode)
    const {MAP_BACKGROUND} = getColors(colorMode)
    const breadcrumbMapNameList = useSelector(state => state.breadcrumbMapNameList)
    const mapSource = useSelector(state => state.mapSource)
    const dispatch = useDispatch()
    const openMapFromBreadcrumbs = index => dispatch({type: 'OPEN_MAP_FROM_BREADCRUMBS', payload: {breadcrumbMapSelected: index}})
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            position: 'fixed',
            left: '50%',
            transform: 'translate(-50%)',
            height: 40,
            background: MAP_BACKGROUND,
            padding: '4px 16px 4px 16px',
            borderRadius: '0 0 16px 16px',
            border: '2px solid #9040b8',
            borderTop: 0,
        }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbMapNameList.map((el, index) => (
                    <Link
                        underline={mapSource === 'dataFrames' ? 'none': 'hover'}
                        href="/"
                        onClick={e => {
                            e.preventDefault()
                            mapSource === 'dataFrames' ? console.log('prevent') : openMapFromBreadcrumbs(index)
                        }}
                        key={index}>
                        {el}
                    </Link>
                ))}>
            </Breadcrumbs>
        </div>
    )
}
