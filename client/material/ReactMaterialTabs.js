import React, {useCallback, useState, useEffect}            from 'react';
import {createMuiTheme }                                    from '@material-ui/core/styles';
import MuiThemeProvider                                     from '@material-ui/core/styles/MuiThemeProvider';
import Tabs                                                 from '@material-ui/core/Tabs';
import Tab                                                  from '@material-ui/core/Tab';
import {updateStateProp} from "../src/Utils";
import {eventRouter} from "../src/EventRouter";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#00ff00',
        },
    },
});

export function SimpleTabs() {

    const [state, setState] = useState({
        tabNames:   [],
        tabId:      0
    });

    useEffect(() => {
        document.addEventListener('toMaterial', handleChangeExt);
        return () => {document.removeEventListener('toMaterial', handleChangeExt)}
    });

    const handleChangeExt = useCallback((e) => {
        setState({
            tabNames:   e.detail.tabData.tabNames,
            tabId:      e.detail.tabData.tabId
        });
    });

    const handleChange = (event, newValue) =>  {

        updateStateProp(state, setState, 'tabId', newValue);

        eventRouter.processEvent({
            type:                                           'materialEvent',
            ref: {
                'cmd':                                      'openAfterTabSelect',
                'tabId':                                    newValue,
            },
        });

    };

    return (
        <MuiThemeProvider theme={theme}>
            <Tabs
                value=                                      {state.tabId}
                onChange=                                   {handleChange}
                indicatorColor=                             "primary">
                {state.tabNames.map(name => (
                    <Tab
                        label=                              {name}
                        key=                                {name}
                    />
                ))}
            </Tabs>
        </MuiThemeProvider>
    )
}
