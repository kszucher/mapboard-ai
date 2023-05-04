import {useSelector} from "react-redux";
import {Button, ButtonGroup} from "@mui/material";
import {AccessTypes} from "../core/Enums";
import {RootState} from "../editor/EditorReducer";

export const TargetedButtonGroup = ({KEYS, value, setValue}: { KEYS: string[], value: string, setValue: Function }) => {
  const access = useSelector((state: RootState) => state.editor.access)
  const disabled = [AccessTypes.UNAUTHORIZED, AccessTypes.VIEW].includes(access)
  return (
    <ButtonGroup className="targeted-button-group" disabled={disabled} variant="text" color="primary">
      {KEYS.map((name, idx) =>
        <Button
          style={{backgroundColor: value === KEYS[idx] ? 'var(--button-color)' : ''}}
          onClick={() => setValue(KEYS[idx])}
          key={idx}>
          {name}
        </Button>
      )}
    </ButtonGroup>
  )
}
