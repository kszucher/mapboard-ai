import {FC} from "react";
import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import {Tab, Tabs} from "@mui/material";
import {sagaActions} from "../core/EditorFlow";

export const TabMaps: FC = () => {
  const tabShrink = useSelector((state: RootStateOrAny) => state.tabShrink)
  const mapSource = useSelector((state: RootStateOrAny) => state.mapSource)
  const tabMapIdList = useSelector((state: RootStateOrAny) => state.tabMapIdList)
  const tabMapNameList = useSelector((state: RootStateOrAny) => state.tabMapNameList)
  const breadcrumbMapIdList = useSelector((state: RootStateOrAny) => state.breadcrumbMapIdList)
  const tabMapSelected = tabMapIdList.indexOf(breadcrumbMapIdList[0])
  const dispatch = useDispatch()
  return (
    <div
      className="_bg fixed top-[96px] border-l-0"
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
        indicatorColor="primary"
        value={tabMapSelected}
        onChange={(e, value) => dispatch(sagaActions.openMapFromTab(value))}
      >
        {
          tabMapNameList.map((name: string, index: number) => (
            <Tab
              disabled={mapSource==='dataFrames'}
              label={tabShrink ? name.at(0) : name}
              key={index}
            />
          ))
        }
      </Tabs>
    </div>
  )
}
