import React from "react";
import FormControl from "@material-ui/core/FormControl";
import {FormControlLabel, FormLabel, Radio, RadioGroup} from "@material-ui/core";

export default function StyledRadioButtonGroup (arg) {
    const {open, valueList, value, action} = arg;
    return (
        open &&
        // <FormControl component="fieldset">
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 32 }}>
                <FormLabel component="legend">Access</FormLabel>
                <RadioGroup
                    aria-label="my-aria-label"
                    name="my-name"
                    value={value}
                    onChange={action}
                    row={true} >
                    {valueList.map((name, index) =>
                        <FormControlLabel
                            value={name}
                            control={<Radio />}
                            label={name}
                            key={index}
                        />
                    )}
                </RadioGroup>
            </div>
        // </FormControl>
    );
}
