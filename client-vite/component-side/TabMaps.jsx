import {useSelector, useDispatch} from "react-redux";
import { Tab, Tabs } from '@mui/material'
import { getColors } from '../core/Colors'

export default function TabMaps() {
    const colorMode = useSelector(state => state.colorMode)
    const tabShrink = useSelector(state => state.tabShrink)
    const {MAP_BACKGROUND, MAIN_COLOR} = getColors(colorMode)
    const tabMapNameList = useSelector(state => state.tabMapNameList)
    const tabMapSelected = useSelector(state => state.tabMapSelected)
    const mapSource = useSelector(state => state.mapSource)
    const dispatch = useDispatch()
    const openMapFromTab = (e, value) =>  dispatch({type: 'OPEN_MAP_FROM_TAB', payload: {tabMapSelected: value}})
    return (
        <div style={{
            position: 'fixed',
            top: 48*2,
            width: tabShrink ? 64 : 216,
            backgroundColor: MAP_BACKGROUND,
            borderTopRightRadius: '16px',
            borderBottomRightRadius: '16px',
            borderLeft: 0,
            borderColor: MAP_BACKGROUND,
        }}>
            <Tabs
                sx={{
                    '.MuiTabs-indicator': {
                        // left: 0,
                        // width: 4,
                        // borderTopRightRadius: 16,
                        // borderBottomRightRadius: 16,
                        backgroundColor: MAIN_COLOR,
                        // backgroundImage: "linear-gradient(180deg, #a4508b 0%, #5f0a87 74%)",
                    },
                    '.MuiButtonBase-root': {
                        minWidth: tabShrink ? 0 : 90
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
                        label={tabShrink ? name.at(0) : name}
                        key={index}
                    />
                ))}>
            </Tabs>
        </div>
    )
}

// TODO no borderRadius if selection == 0 or selection == end
// TODO selection on the right too for formatters
// TODO dont close formatters on click, only by CLOSE!
// TODO open modal for mapinmap
