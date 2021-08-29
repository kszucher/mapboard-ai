import React, {useContext} from 'react'
import {Context} from "../core/Store";
import {Modal} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import StyledButton from "../component-styled/StyledButton";

export function SharingEditor() {
    const [state, dispatch] = useContext(Context);
    const {sharingEditorVisible} = state;

    const closeSharingEditor = _ => dispatch({type: 'CLOSE_SHARING_EDITOR'})

    return(
        <Modal
            open={sharingEditorVisible}
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
                <Typography component="h1" variant="h5">MapBoard</Typography>

                <StyledButton name={'Close'} action={closeSharingEditor}/>


            </div>}
        </Modal>
    )
}

// kell egy input mező, ahova be lehet írni egy email-t,
// kell egy check validity gomb, ami megmondja, hogy létezik-e ez a user, hasonlóan ahhoz, mint a "signUpStep1FailEmailAlreadyInUse" esetén
// kell egy save
// meg persze kell egy kijelzés arról, hogy van-e már share-elve
// aztán meg az ELFOGADÁS-t is tesztelgetni kell
// lesz ezzel szép kis munka
// my map, alatta meg a 3 shared map legyen
// saját magammal is meg kell osztanom a minta-map-eket, amik egy főmotkány userhez lesznek áttéve
