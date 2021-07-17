import React, {useContext, useEffect} from 'react';
import {Context} from "../core/Store";
import StyledButton from "../component-styled/StyledButton";
import {List} from "@material-ui/core";

export function FrameEditor () {
    const [state, dispatch] = useContext(Context);
    const {serverResponse, serverResponseCntr} = state;

    const closeFrameEditor = _ => dispatch({type: 'CLOSE_FRAME_EDITOR'})

    useEffect(() => {

    }, []);

    useEffect(() => {
        if (serverResponse.cmd === 'openMapSuccess') {
            let {breadcrumbMapNameList} = serverResponse.payload;
            setBreadcrumbMapNameList(breadcrumbMapNameList);
        }
    }, [serverResponseCntr]);

    const xWidth = 192;
    const yWidth = 300;
    const dense = 'small'

    return (
        <div style={{
            position: 'fixed', top: 216+96+48, right: 0, width: xWidth, height: yWidth, backgroundColor: 'rgba(251,250,252,1)',
            paddingTop: 12, paddingLeft: 12, paddingRight: 12, paddingBottom: 12,
            borderTopLeftRadius: 16, borderBottomLeftRadius: 16, borderWidth: '1px', borderStyle: 'solid', borderColor: '#dddddd', borderRight: 0 }}>

            <List dense={dense}>
                {generate(
                    <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <FolderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary="Single-line item"
                            secondary={secondary ? 'Secondary text' : null}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>,
                )}
            </List>

            <div style={{display: "flex", flexDirection: 'row', justifyContent: 'center', paddingTop: 12 }}>
                <StyledButton name={'Close'} action={closeFrameEditor}/>
            </div>
        </div>
    );
}
