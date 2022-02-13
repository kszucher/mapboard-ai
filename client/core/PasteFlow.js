import {isEditing, mapDispatch} from "./MapFlow";
import {checkPop, push, redraw} from "./MapStateFlow";
import {isUrl} from "./Utils";

export const pasteDispatch = (dispatch) => {
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.read().then(item => {
                let type = item[0].types[0];
                if (type === 'text/plain') {
                    navigator.clipboard.readText().then(text => {
                        if (isEditing) {
                            mapDispatch('insertTextFromClipboardAsText', text);
                        } else {
                            push();
                            if (text.substring(0, 1) === '[') {
                                mapDispatch('insertMapFromClipboard', text);
                            } else {
                                mapDispatch('insert_O_S');
                                redraw();
                                if (text.substring(0, 2) === '\\[') { // double backslash counts as one character
                                    mapDispatch('insertEquationFromClipboardAsNode', text);
                                } else if (isUrl(text)) {
                                    mapDispatch('insertElinkFromClipboardAsNode', text);
                                } else {
                                    mapDispatch('insertTextFromClipboardAsNode', text);
                                }
                            }
                            redraw();
                            checkPop(dispatch);
                        }
                    });
                }
                if (type === 'image/png') {
                    if (isEditing) {

                    } else {
                        item[0].getType('image/png').then(image => {
                            var formData = new FormData();
                            formData.append('upl', image, 'image.png');
                            let address = process.env.NODE_ENV === 'development' ?
                                'http://127.0.0.1:8082/feta' :
                                'https://mapboard-server.herokuapp.com/feta';
                            fetch(address, {method: 'post', body: formData}).then(response =>
                                response.json().then(response => {
                                        push();
                                        mapDispatch('insert_O_S');
                                        mapDispatch('insertImageFromLinkAsNode', response);
                                        redraw();
                                        checkPop(dispatch);
                                    }
                                )
                            );
                        })
                    }
                }
            })
        }
    });
}
