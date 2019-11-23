import React, {useCallback}                                 from 'react';
import  { useState, useEffect }                             from 'react';
import { createMuiTheme }                                   from '@material-ui/core/styles';
import MuiThemeProvider                                     from '@material-ui/core/styles/MuiThemeProvider';
import Tabs                                                 from '@material-ui/core/Tabs';
import Tab                                                  from '@material-ui/core/Tab';
import {mindBoardApi}                                       from "./MindBoardApi";

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#00ff00',
        },
    },
});

export function ReactMaterialTabHolder() {

    const [value, setValue] = useState({
        tabNames: []
    });

    const updater = useCallback((e) => {
        setValue({
            tabNames: e.detail.tabData.tabNames
        });
    });

    useEffect(() => {
        document.addEventListener("event", updater);
        return () => {
            document.removeEventListener("event", updater)
        }
    });

    return (
        <ReactMaterialTab
            value={value}
        >
        </ReactMaterialTab>
    )
}

export function ReactMaterialTab(pass) {

    const [value, setValue] = useState(0);

    const updater = useCallback((e) => {
        setValue(e.detail.tabData.tabId);
    });

    useEffect(() => {
        // https://stackoverflow.com/questions/54569681/cannot-remove-an-event-listener-outside-useeffect
        document.addEventListener("event", updater);
        return () => {
            document.removeEventListener("event", updater)
        }
    });

    function handleChange(event, newValue) {
        setValue(newValue);
        mindBoardApi.request({
            'cmd':      'openAfterTabSelect',
            'tabId':     newValue
        })
    }

    return (
        <MuiThemeProvider theme={theme}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary">
                {pass.value.tabNames.map(name => (
                    <Tab
                        label={name}
                        key = {name} />
                ))}
            </Tabs>
        </MuiThemeProvider>
    );
}
