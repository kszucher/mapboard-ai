import React, {useContext} from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Context} from "../core/Store";

export default function WorkspaceBreadcrumbs() {
    const [state, dispatch] = useContext(Context);
    const {breadcrumbsHistory} = state;

    const handleClick = index => event => {dispatch({type: 'OPEN_MAP', payload: {source: 'BREADCRUMBS', index}})};

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
            backgroundColor: '#fbfafc',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
            borderWidth: '2px',
            borderStyle: 'solid',
            borderColor: '#9040b8',
            borderTop: 0,
        }}>
            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                {breadcrumbsHistory.map((currElement, index) => (
                    <Link
                        color="inherit"
                        href="/"
                        onClick={handleClick(index)}
                        key={index}>
                        {currElement.mapName}
                    </Link>
                ))}>
            </Breadcrumbs>
        </div>
    );
}
