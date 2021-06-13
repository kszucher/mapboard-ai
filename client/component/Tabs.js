import React, {useContext, useEffect, useState} from 'react';
import {Context} from "../core/Store";
import StyledTabs from "../component-styled/StyledTabs";

export default function Tabs() {
    const [state, dispatch] = useContext(Context);
    const {serverResponse, serverResponseCntr} = state;
    const [mapNameList, setMapNameList] = useState([]);
    const [mapSelected, setMapSelected] = useState(0);

    const handleChange = (e, value) =>  {
        setMapSelected(value);
        dispatch({type: 'OPEN_MAP_FROM_TAB', payload: {mapSelected: value}})
    };

    useEffect(() => {
        if (serverResponse.cmd === 'openMapSuccess') {
            let {mapNameList, mapSelected} = serverResponse.payload;
            setMapNameList(mapNameList);
            setMapSelected(mapSelected);
        }
    }, [serverResponseCntr]);

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
                component={'tabs'}/>
        </div>
    );
}
