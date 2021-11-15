import React from 'react';
import {useSelector, useDispatch} from "react-redux";
import StyledTabs from "../component-styled/StyledTabs";
import {COLORS} from "../core/Utils";

export default function Tabs() {
    const tabMapNameList = useSelector(state => state.tabMapNameList)
    const tabMapSelected = useSelector(state => state.tabMapSelected)
    const isPlayback = useSelector(state => state.isPlayback)
    const dispatch = useDispatch()

    const handleChange = (e, value) =>  {
        dispatch({type: 'SET_TAB_DATA', payload: {tabMapNameList, tabMapSelected: value}})
        dispatch({type: 'OPEN_MAP_FROM_TAB', payload: {tabMapSelected: value}})
    };

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
            <StyledTabs
                valueList={tabMapNameList}
                value={tabMapSelected}
                onChange={handleChange}
                orientation={'vertical'}
                component={'tabs'}
                disabled={isPlayback}
            />
        </div>
    );
}
