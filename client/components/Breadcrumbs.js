import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}

export default function WorkspaceBreadcrumbs() {
    const classes = useStyles();

    // const [state, dispatch] =

    return (
        <div className={classes.root}>

            <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">

                {/*{state.tabNames.map(name => (*/}
                {/*    <Link color="inherit" href="/" onClick={handleClick}>*/}
                {/*        Books*/}
                {/*    </Link>*/}
                {/*))}>*/}

                <Typography color="textPrimary">
                    Straight talk for startups
                </Typography>

            </Breadcrumbs>

        </div>
    );
}
