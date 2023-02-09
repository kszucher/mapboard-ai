import {FC} from "react";
import {useSelector, useDispatch, RootStateOrAny} from "react-redux";
import {Tab, Tabs} from "@mui/material";
import {api, useOpenWorkspaceQuery} from "../core/Api";
import {defaultUseOpenWorkspaceQueryState} from "../core/EditorFlow";
import {PageState} from "../core/Types";

export const TabMaps: FC = () => {
  const pageState = useSelector((state: RootStateOrAny) => state.editor.pageState)
  const tabShrink = useSelector((state: RootStateOrAny) => state.editor.tabShrink)
  const { data, isFetching } = useOpenWorkspaceQuery(undefined, { skip:  pageState === PageState.AUTH  })
  const { frameId, tabMapIdList, tabMapNameList, tabId } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch()
  return (
    <div
      className="_bg fixed top-[96px] border-l-0"
      style={{
        width: tabShrink ? 64 : 224,
        borderTopRightRadius: tabId === 0 ? 0 : 16,
        borderBottomRightRadius: tabId === tabMapNameList.length - 1 ? 0 : 16,
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
        value={tabId}
        onChange={(e, value) => dispatch(api.endpoints.selectMap.initiate({mapId: tabMapIdList[value], frameId: ''})) }
      >
        {
          tabMapNameList.map((el: { name: string }, index: number) => (
            <Tab
              disabled={frameId !== ''}
              label={tabShrink ? el.name.at(0) : el.name}
              key={index}
            />
          ))
        }
      </Tabs>
    </div>
  )
}
