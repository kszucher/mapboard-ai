import { Button, ButtonGroup } from '@mui/material'

export default function StyledButtonGroup (arg) {
    const {open, valueList, value, action, size, disabled, valueListDisabled} = arg;
    return (
        open && <div>
            <ButtonGroup
                disabled={disabled || false}
                size={size || 'small'}
                variant="text"
                // color="primary"
                aria-label="text primary button group">
                {valueList.map((name, index) =>
                    <Button
                        disabled={valueListDisabled && valueListDisabled[index] || false}
                        style ={{backgroundColor: value === valueList[index]? '#eeeaf2':''}}
                        onClick={e=>action(valueList[index])}
                        key={index}>
                        {name}
                    </Button>
                )}
            </ButtonGroup>
        </div>
    )
}
