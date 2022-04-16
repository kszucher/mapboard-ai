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

    const handleClick = index => event => {
        event.preventDefault();
        dispatch({type: 'OPEN_MAP_FROM_BREADCRUMBS', payload: {breadcrumbMapSelected: index}})
    };

    const doNothing = _ => event => {
        event.preventDefault();
    }

    return (
        <div style={{
            position: 'fixed',
            left: '50%',
            transform: 'translate(-50%)',
            display: 'flex',
            alignItems: 'center',
            height: 40+2*12,
            paddingLeft: '20px',
            paddingRight: '20px',
            backgroundColor: MAP_BACKGROUND,
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderTop: 0,
            borderColor: '#9040b8',
        }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbMapNameList.map((el, index) => (
                    <Link
                        // color="inherit"
                        href="/"
                        onClick={mapSource === 'dataPlayback' ? doNothing() : handleClick(index)}
                        key={index}>
                        {el}
                    </Link>
                ))}>
            </Breadcrumbs>
        </div>
    );
}
