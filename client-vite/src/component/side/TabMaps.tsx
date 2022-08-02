import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import { Tab, Tabs } from '@mui/material'

export default function TabMaps() {
    const tabShrink = useSelector((state: RootStateOrAny) => state.tabShrink)
    const mapSource = useSelector((state: RootStateOrAny) => state.mapSource)
    const tabMapIdList = useSelector((state: RootStateOrAny) => state.tabMapIdList)
    const tabMapNameList = useSelector((state: RootStateOrAny) => state.tabMapNameList)
    const breadcrumbMapIdList = useSelector((state: RootStateOrAny) => state.breadcrumbMapIdList)
    const tabMapSelected = tabMapIdList.indexOf(breadcrumbMapIdList[0])
    const dispatch = useDispatch()
    const openMapFromTab = (e, value) =>  dispatch({type: 'OPEN_MAP_FROM_TAB', payload: {tabMapSelected: value}})
    return (
        <div
            id="tab-maps"
            style={{
                width: tabShrink ? 64 : 224,
                borderTopRightRadius: tabMapSelected === 0 ? 0 : 16,
                borderBottomRightRadius: tabMapSelected === tabMapNameList.length - 1 ? 0 : 16,
            }}>
            <Tabs
                sx={{
                    '.MuiTabs-indicator': { backgroundColor: 'var(--main-color)' },
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
