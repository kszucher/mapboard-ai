import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import {COLORS} from "../core/Utils";
import Tab from '@material-ui/core/Tab'
import Tabs from "@material-ui/core/Tabs";
import { makeStyles } from '@material-ui/core/styles'

const getStyle = (theme) => {
    return {
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
        }
    }
}

export default function Entries() {
    const tabMapNameList = useSelector(state => state.tabMapNameList)
    const tabMapSelected = useSelector(state => state.tabMapSelected)
    const mapSource = useSelector(state => state.mapSource)
    const dispatch = useDispatch()
    const openMapFromTab = (e, value) =>  dispatch({type: 'OPEN_MAP_FROM_TAB', payload: {tabMapSelected: value}})
    const classes = makeStyles((theme) => (getStyle(theme)))()
    return (
        <div style={{
            position: 'fixed',
            top: 48*2,
            width: 216,
            backgroundColor: COLORS.MAP_BACKGROUND,
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderLeft: 0
        }}>
            <div className={classes.root}>
                <Tabs
                    classes={{indicator: classes.indicator}}
                    orientation={'vertical'}
                    variant="scrollable"
                    aria-label="Vertical tabs example"
                    className={classes.tabs}
                    value={tabMapSelected}
                    onChange={openMapFromTab}
                    indicatorColor="primary" >
                    {tabMapNameList.map((name, index) => (
                        <Tab
                            disabled={mapSource==='dataPlayback'}
                            label={name}
                            key={index}/>
                    ))}>
                </Tabs>
            </div>
        </div>
    )
}
