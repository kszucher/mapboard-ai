import {FC} from "react";
import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import {Tab, Tabs} from "@mui/material";
import {api, useOpenMapQuery} from "../core/Api";

export const TabMaps: FC = () => {
  const tabShrink = useSelector((state: RootStateOrAny) => state.editor.tabShrink)
  const { data, isFetching } = useOpenMapQuery(null, {skip: false})
  const { mapSource, tabMapIdList, tabMapNameList, breadcrumbMapIdList } = data?.resp?.data
  || { mapSource: '', tabMapIdList: [], tabMapNameList: [], breadcrumbMapIdList: [] }
  const tabMapSelected = tabMapIdList.indexOf(breadcrumbMapIdList[0])
  const dispatch = useDispatch()
  return (
    <>
      {!isFetching &&
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
            onChange={(e, value) => dispatch(api.endpoints.selectMapFromTab.initiate({mapId: tabMapIdList[value]})) }
            // onChange={(e, value) => dispatch(sagaActions.openMapFromTab(value))}
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
      }
    </>
  )
}
