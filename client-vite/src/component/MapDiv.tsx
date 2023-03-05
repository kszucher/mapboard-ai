import {FC, Fragment} from "react";
import {RootStateOrAny, useSelector} from "react-redux";
import {copy, isEqual} from "../core/Utils";
import {getColors} from "../core/Colors";
import {M, N} from "../types/DefaultProps";

export const MapDiv: FC = () => {
  const colorMode = 'dark'
  const C = getColors(colorMode)
  const mdi = useSelector((state: RootStateOrAny) => state.editor.mapIndexList)
  const md = useSelector((state: RootStateOrAny) => state.editor.mapList)
  const tempMap = useSelector((state: RootStateOrAny) => state.editor.tempMap)
  const m = mdi === -1 ? md[mdi] : tempMap

  return (
    <div
      id='mapDiv'
      style={{
        position: 'absolute',
        display: 'flex',
        pointerEvents: 'none'
      }}
    >
      <>

      </>
    </div>
  )
}
