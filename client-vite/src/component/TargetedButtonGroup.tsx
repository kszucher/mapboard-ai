import {RootStateOrAny, useSelector} from "react-redux";
import {Button, ButtonGroup} from "@mui/material";
import {MapRight} from "../core/Types";

export const TargetedButtonGroup = ({KEYS, value, setValue}: { KEYS: string[], value: string, setValue: Function }) => {
  const mapRight = useSelector((state: RootStateOrAny) => state.mapRight)
  const disabled = [MapRight.UNAUTHORIZED, MapRight.VIEW].includes(mapRight)
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
