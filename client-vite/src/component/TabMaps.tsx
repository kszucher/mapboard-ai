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
            selected={tabMapIdList[tabId]}
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
                    nodeId={tabMapIdList[index]}
                    key={index}
                    onClick={() => {
                      dispatch(api.endpoints.selectMap.initiate({mapId: tabMapIdList[index], frameId: ''}))
                    }}
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
