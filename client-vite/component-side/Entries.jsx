import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import { Tab, Tabs } from '@mui/material'
import { getColors } from '../core/Colors'

export default function Entries() {
    const tabMapNameList = useSelector(state => state.tabMapNameList)
    const tabMapSelected = useSelector(state => state.tabMapSelected)
    const mapSource = useSelector(state => state.mapSource)
    const dispatch = useDispatch()
    const openMapFromTab = (e, value) =>  dispatch({type: 'OPEN_MAP_FROM_TAB', payload: {tabMapSelected: value}})
    return (
        <div style={{
            position: 'fixed',
            top: 48*2,
            width: 216,
            backgroundColor: getColors('light').MAP_BACKGROUND,
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: '#dddddd',
            borderLeft: 0
        }}>
            <Tabs
                sx={{
                    '.MuiTabs-indicator': {
                        left: "0px",
                        width: "8px",
                        borderTopRightRadius: "16px",
                        borderBottomRightRadius: "16px",
                        backgroundImage: "linear-gradient(180deg, #a4508b 0%, #5f0a87 74%)",
                    }
                }}
                orientation={'vertical'}
                variant="scrollable"
                aria-label="Vertical tabs example"
                value={tabMapSelected}
                onChange={openMapFromTab}
                indicatorColor="primary" >
                {tabMapNameList.map((name, index) => (
                    <Tab
                        disabled={mapSource==='dataPlayback'}
                        label={name}
                        key={index}
                    />
                ))}>
            </Tabs>
        </div>
    )
}
