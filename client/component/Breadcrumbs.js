import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Context} from "../core/Store";

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

export default function WorkspaceBreadcrumbs() {
    const classes = useStyles();

    const [state, dispatch] = useContext(Context);
    const {breadcrumbsHistory} = state;

    const handleClick = index => event => {
        event.preventDefault();
        dispatch({type: 'OPEN_MAP', payload: {source: 'BREADCRUMBS', index}});
    };

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
        }}>
            <div className={classes.root}>
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
        </div>
    );
}
