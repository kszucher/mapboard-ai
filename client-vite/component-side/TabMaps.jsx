import {useSelector, useDispatch} from "react-redux";
import { Tab, Tabs } from '@mui/material'
import { getColors } from '../core/Colors'

export default function TabMaps() {
    const colorMode = useSelector(state => state.colorMode)
    const tabShrink = useSelector(state => state.tabShrink)
    const {MAP_BACKGROUND, PAGE_BACKGROUND, MAIN_COLOR} = getColors(colorMode)
    const mapSource = useSelector(state => state.mapSource)
    const tabMapIdList = useSelector(state => state.tabMapIdList)
    const tabMapNameList = useSelector(state => state.tabMapNameList)
    const breadcrumbMapIdList = useSelector(state => state.breadcrumbMapIdList)
    const tabMapSelected = tabMapIdList.indexOf(breadcrumbMapIdList[0])
    const dispatch = useDispatch()
    const openMapFromTab = (e, value) =>  dispatch({type: 'OPEN_MAP_FROM_TAB', payload: {tabMapSelected: value}})
    return (
        <div style={{
            position: 'fixed',
            top: 48*2,
            width: tabShrink ? 64 : 224,
            backgroundColor: MAP_BACKGROUND,
            borderTopRightRadius: tabMapSelected === 0 ? 0 : 16,
            borderBottomRightRadius: tabMapSelected === tabMapNameList.length - 1 ? 0 : 16,
            borderTop: `1px solid ${PAGE_BACKGROUND}`,
            borderRight: `1px solid ${PAGE_BACKGROUND}`,
            borderBottom: `1px solid ${PAGE_BACKGROUND}`,
            borderLeft: 0,
        }}>
            <Tabs
                sx={{
                    '.MuiTabs-indicator': { backgroundColor: MAIN_COLOR },
                    '.MuiButtonBase-root': { minWidth: tabShrink ? 0 : 90 }
                }}
                orientation={'vertical'}
                variant="scrollable"
                aria-label="Vertical tabs example"
                value={tabMapSelected}
                onChange={openMapFromTab}
                indicatorColor="primary" >
                {tabMapNameList.map((name, index) => (
                    <Tab
                        disabled={mapSource==='dataFrames'}
                        label={tabShrink ? name.at(0) : name}
                        key={index}
                    />
                ))}>
            </Tabs>
        </div>
    )
}
