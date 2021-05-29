import {isEditing, nodeDispatch} from "./NodeFlow";
import {checkPop, push, redraw} from "./MapFlow";
import {isUrl} from "./Utils";

export const pasteDispatch = () => {
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state === "granted" || result.state === "prompt") {
            navigator.clipboard.read().then(item => {
                let type = item[0].types[0];
                if (type === 'text/plain') {
                    navigator.clipboard.readText().then(text => {
                        if (isEditing) {
                            nodeDispatch('insertTextFromClipboardAsText', text);
                        } else {
                            push();
                            if (text.substring(0, 1) === '[') {
                                nodeDispatch('insertMapFromClipboard', text);
                            } else {
                                nodeDispatch('insert_O_S');
                                redraw();
                                if (text.substring(0, 2) === '\\[') { // double backslash counts as one character
                                    nodeDispatch('insertEquationFromClipboardAsNode', text);
                                } else if (isUrl(text)) {
                                    nodeDispatch('insertElinkFromClipboardAsNode', text);
                                } else {
                                    nodeDispatch('insertTextFromClipboardAsNode', text);
                                }
                            }
                            redraw();
                            checkPop();
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
                                'https://mindboard.io/feta';
                            fetch(address, {method: 'post', body: formData}).then(response =>
                                response.json().then(response => {
                                        push();
                                        nodeDispatch('insert_O_S');
                                        nodeDispatch('insertImageFromLinkAsNode', response);
                                        redraw();
                                        checkPop();
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
