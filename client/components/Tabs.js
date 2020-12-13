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
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}));

export default function VerticalTabs() {
    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const {tabListIds, tabListNames, tabListSelected} = state;
    const [val, setVal] = useState(tabListSelected);

    const handleChange = (e, value) =>  {
        setVal(value);
        dispatch({type: 'SET_MAP_ID', payload: {
                mapId: tabListIds[value],
                mapName: tabListNames[value],
                pushHistory: true,
                breadcrumbsOp: 'resetPush'}});
    };

    return (
        <div className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                aria-label="Vertical tabs example"
                className={classes.tabs}
                value={val}
                onChange={handleChange}
                indicatorColor="primary">
                {tabListNames.map(name => (
                    <Tab
                        label={name}
                        key={name}/>
                ))}>
            </Tabs>
        </div>
    );
}
