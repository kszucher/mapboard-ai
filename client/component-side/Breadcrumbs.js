import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {COLORS} from "../core/Utils";

export default function WorkspaceBreadcrumbs() {
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
            height: '48px',
            paddingLeft: '20px',
            paddingRight: '20px',
            backgroundColor: COLORS.MAP_BACKGROUND,
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#9040b8',
            borderTop: 0,
        }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbMapNameList.map((el, index) => (
                    <Link
                        color="inherit"
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
