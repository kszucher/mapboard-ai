import React, {useContext} from 'react'
import {Context} from "../core/Store";
import Auth from "./Auth";
import {muiTheme} from "../component-styled/Theme";
import {Modal, MuiThemeProvider} from "@material-ui/core";
import {MapComponent} from "./MapComponent";
import Logo from "./Logo";
import Tabs from "./Tabs";
import {CommandButtons} from "./CommandButtons";
import Breadcrumbs from "./Breadcrumbs";
import {CommandTexts} from "./CommandTexts";
import {Palette} from "./Palette";
import {FrameEditor} from "./FrameEditor";
import {PAGE_STATES} from "../core/EditorFlow";
import Typography from "@material-ui/core/Typography";

export function Page() {
    const [state, dispatch] = useContext(Context);
    const {pageState, paletteVisible, frameEditorVisible, sharingEditorVisible} = state;
    return(
        <div id="page">
            <MuiThemeProvider theme={muiTheme}>
                {[PAGE_STATES.DEMO, PAGE_STATES.WORKSPACE].includes(pageState) && <>
                    <MapComponent/>
                    <Logo/>
                    {pageState === PAGE_STATES.WORKSPACE && <>
                        <Tabs/>
                        <CommandButtons/>
                        <Breadcrumbs/>
                        <CommandTexts/>
                    </>}
                    {paletteVisible===1 && <Palette/>}
                    {frameEditorVisible===1 && <FrameEditor/>}
                </>}
                {pageState === PAGE_STATES.AUTH && <Auth/>}
                {sharingEditorVisible && <>
                    <Modal
                        open={true}
                        onClose={_=>{}}
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                    >
                        {<div style={{
                            position: 'relative',
                            left: '50%',
                            transform: 'translate(-50%)',
                            top: 96,
                            width: 48*8,
                            flexDirection: 'column',
                            alignItems: 'center',
                            display: 'inline-flex',
                            flexWrap: 'wrap',
                            gap: 16,
                            backgroundColor: '#fbfafc',
                            padding: 20,
                            border: "1px solid #fbfafc",
                            borderRadius: '16px'
                        }}>
                            <Typography component="h1" variant="h5">SHARING EDITOR</Typography>

                        </div>}
                    </Modal>
                </>}
            </MuiThemeProvider>
        </div>
    )
}
