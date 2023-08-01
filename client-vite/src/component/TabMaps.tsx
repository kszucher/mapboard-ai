import {TreeItem} from "@mui/lab";
import React, {FC} from "react"
import {useSelector, useDispatch} from "react-redux"
import TreeView from '@mui/lab/TreeView'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {api, useOpenWorkspaceQuery} from "../core/Api"
import {AppDispatch, RootState} from "../core/EditorReducer"
import {defaultUseOpenWorkspaceQueryState} from "../state/ApiState"

export const TabMaps: FC = () => {
  const tabShrink = useSelector((state: RootState) => state.editor.tabShrink)
  const { data } = useOpenWorkspaceQuery()
  const { frameId, tabMapIdList, tabMapNameList, tabId } = data || defaultUseOpenWorkspaceQueryState
  const dispatch = useDispatch<AppDispatch>()
  return (
    <>
      {!tabShrink &&
        <div
          className="_bg fixed top-[80px] border-l-0 z-50"
          style={{
            width: 224,
            borderTopRightRadius: 8,
            borderBottomRightRadius: 8,
          }}>
          {/*<Tabs*/}
          {/*  sx={{*/}
          {/*    '.MuiTabs-indicator': { backgroundColor: 'var(--main-color)' },*/}
          {/*    '.MuiButtonBase-root': { minWidth: tabShrink ? 0 : 90 }*/}
          {/*  }}*/}
          {/*  orientation={'vertical'}*/}
          {/*  variant="scrollable"*/}
          {/*  aria-label="Vertical tabs example"*/}
          {/*  indicatorColor="primary"*/}
          {/*  value={tabId}*/}
          {/*  onChange={(e, value) =>*/}
          {/*    dispatch(api.endpoints.selectMap.initiate({mapId: tabMapIdList[value], frameId: ''}))*/}
          {/*  }>*/}
          {/*  {*/}
          {/*    tabMapNameList.map((el: { name: string }, index: number) => (*/}
          {/*      <Tab*/}
          {/*        sx={{*/}
          {/*          '.MuiTab-root': { textTransform: 'none' },*/}
          {/*        }}*/}
          {/*        disabled={frameId !== ''}*/}
          {/*        label={tabShrink ? el.name.at(0) : el.name}*/}
          {/*        key={index}*/}
          {/*      />*/}
          {/*    ))*/}
          {/*  }*/}
          {/*</Tabs>*/}


          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            sx={{
              flexGrow: 1,
              maxWidth: 400,
              overflowY: 'auto',
            }}
            defaultExpanded={['applications']}
          >
            <TreeItem
              nodeId="applications"
              label="Applications"
              sx={{
                '.MuiTreeItem-label': { color: 'var(--main-color)' },
                '.MuiTreeItem-iconContainer': { color: 'var(--main-color)' },
              }}
            >
              {
                tabMapNameList.map((el: { name: string }, index: number) => (
                  <TreeItem
                    disabled={frameId !== ''}
                    label={tabShrink ? el.name.at(0) : el.name}
                    nodeId={'map-' + (index).toString()}
                    key={index}
                  />
                ))
              }
            </TreeItem>
            {/*<TreeItem nodeId="5" label="Documents">*/}
            {/*  <TreeItem nodeId="10" label="OSS" />*/}
            {/*  <TreeItem nodeId="6" label="MUI">*/}
            {/*  </TreeItem>*/}
            {/*</TreeItem>*/}
          </TreeView>
        </div>
      }
    </>
  )
}
