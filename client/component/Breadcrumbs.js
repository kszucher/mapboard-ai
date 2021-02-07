import React, {useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import {Context} from "../core/Store";
import '../component-css/Breadcrumbs.css'

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
        <div id = 'breadcrumbsContainer'>
            <div id = 'breadcrumbs'>
                <div className={classes.root}>
                    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
                        {breadcrumbsHistory.map((currElement, index) => (
                            <Link
                                color="inherit"
                                href="/"
                                onClick={handleClick(index)}
                                key={index}
                            >
                                {currElement.mapName}
                            </Link>
                        ))}>
                    </Breadcrumbs>
                </div>
            </div>
        </div>
    );
}
