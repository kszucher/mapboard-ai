import React, {useContext} from 'react';
import {Context} from "../core/Store";
import StyledTabs from "../component-styled/StyledTabs";

export default function VerticalTabs() {
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
            <StyledTabs
                valueList={mapNameList}
                value={mapSelected}
                onChange={handleChange}
                orientation={'vertical'}
                component={'mapSelector'}/>
        </div>
    );
}
