import React, {useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import {updateStateProp} from "../core/Utils";
import {eventRouter} from "../core/EventRouter";

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
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function VerticalTabs() {
    const classes = useStyles();

    const [state, setState] = useState({
        tabNames: [],
        tabId: 0
    });

    useEffect(() => {
        document.addEventListener('toMaterial', handleChangeExt);
        return () => {document.removeEventListener('toMaterial', handleChangeExt)}
    });

    const handleChangeExt = useCallback((e) => {
        setState({
            tabNames: e.detail.tabData.tabNames,
            tabId: e.detail.tabData.tabId
        });
    });

    const handleChange = (event, newValue) =>  {
        updateStateProp(state, setState, 'tabId', newValue);
        eventRouter.processEvent({
            type: 'componentEvent',
            ref: {
                'cmd': 'openAfterTabSelect',
                'tabId': newValue,
            },
        });
    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                aria-label="Vertical tabs example"
                className={classes.tabs}
                value={state.tabId}
                onChange={handleChange}
                indicatorColor="primary">
                {state.tabNames.map(name => (
                    <Tab
                        label={name}
                        key={name}
                    />
                ))}
            >
            </Tabs>
        </div>
    );
}
