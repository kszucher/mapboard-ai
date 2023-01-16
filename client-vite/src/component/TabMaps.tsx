import {FC} from "react";
import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import {Tab, Tabs} from "@mui/material";
import {api, useOpenMapQuery} from "../core/Api";
import {defaultUseOpenMapQueryState} from "../core/EditorFlow";

export const TabMaps: FC = () => {
  const tabShrink = useSelector((state: RootStateOrAny) => state.editor.tabShrink)
  const { data, isFetching } = useOpenMapQuery()
  const { dataFrameSelected, tabMapIdList, tabMapNameList, breadcrumbMapIdList } = data?.resp?.data || defaultUseOpenMapQueryState
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
        onChange={(e, value) => dispatch(api.endpoints.selectMap.initiate({mapId: tabMapIdList[value]})) }
      >
        {
          tabMapNameList.map((name: string, index: number) => (
            <Tab
              disabled={dataFrameSelected > -1}
              label={tabShrink ? name.at(0) : name}
              key={index}
            />
          ))
        }
      </Tabs>
    </div>
  )
}
