import React, {useContext} from 'react';
import {Context} from "../core/Store";
import StyledTabs from "../component-styled/StyledTabs";

export default function Tabs() {
    const [state, dispatch] = useContext(Context);
    const {tabMapNameList, tabMapSelected, isPlayback} = state;

    const handleChange = (e, value) =>  {
        dispatch({type: 'OPEN_MAP_FROM_TAB', payload: {value}})
    };

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
