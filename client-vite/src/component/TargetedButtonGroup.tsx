import {MAP_RIGHTS} from "../core/EditorFlow";
import {RootStateOrAny, useSelector} from "react-redux";
import {Button, ButtonGroup} from "@mui/material";

export const TargetedButtonGroup = ({KEYS, value, setValue}: { KEYS: string[], value: string, setValue: Function }) => {
  const {UNAUTHORIZED, VIEW} = MAP_RIGHTS
  const mapRight = useSelector((state: RootStateOrAny) => state.mapRight)
  const disabled = [UNAUTHORIZED, VIEW].includes(mapRight)
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
