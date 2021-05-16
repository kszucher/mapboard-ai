import React, {useContext} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Context} from "../core/Store";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        display: 'flex-start',
    },
    tabs: {
        borderRight: `0px solid ${theme.palette.divider}`,
    },
    indicator: {
        left: "0px",
        width: "8px",
        borderTopRightRadius: "16px",
        borderBottomRightRadius: "16px",
        backgroundImage: "linear-gradient(180deg, #a4508b 0%, #5f0a87 74%)",
    },
}));

export default function VerticalTabs() {
    const classes = useStyles();
    const [state, dispatch] = useContext(Context);
    const {mapSelected, mapNameList} = state;

    const handleChange = (e, value) =>  {dispatch({type: 'OPEN_MAP', payload: {source: 'TAB', value}})};

    return (
        <div style={{
            position: 'fixed',
            top: 48*2,
            width: 216,
            backgroundColor: '#fbfafc',
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderLeft: 0
        }}>
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
                            key={index}/>
                    ))}>
                </Tabs>
            </div>
        </div>
    );
}
