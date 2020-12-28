import React, {useContext, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {Context} from "../core/Store";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={3}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        // backgroundColor: theme.palette.background.paper,
        display: 'flex-start',
    },
    tabs: {
        borderRight: `0px solid ${theme.palette.divider}`,
    },
    indicator: {
        // left: "500px",
        width: "2px",
        // borderTopRightRadius: "32px",
        // borderBottomRightRadius: "32px",
        //
        //
        //
        backgroundColor: "#a4508b",
        backgroundImage: "linear-gradient(180deg, #a4508b 0%, #5f0a87 74%)"

        // backgroundColor: "#fbfafc"

        // padding: "-10px"
    },
}));

export default function VerticalTabs() {
    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const {mapNameList, mapSelected} = state;

    const handleChange = (e, value) =>  {
        dispatch({type: 'OPEN_MAP', payload: {source: 'TAB', value}});
    };

    return (
        <div className={classes.root}>
            <Tabs
                classes={{
                    indicator: classes.indicator
                }}
                orientation="vertical"
                variant="scrollable"
                aria-label="Vertical tabs example"
                className={classes.tabs}
                value={mapSelected}
                onChange={handleChange}
                indicatorColor="primary">
                {mapNameList.map((name, index) => (
                    <Tab
                        label={name}
                        key={index}
                    />
                ))}>
            </Tabs>
        </div>
    );
}
