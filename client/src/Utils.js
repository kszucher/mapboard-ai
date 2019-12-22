import {lastEvent} from "./EventListener";
import {getDim} from "./Dim";

export function getBgc() {
    return '#fbfafc';
}

export function arrayValuesSame(array) {
    let first = JSON.stringify(array[0]);
    for (let i = 1; i < array.length; i++) {
        if (JSON.stringify(array[i]) !== first) {
            return false;
        }
    }
    return true;
}

// https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
export function createArray(length) {
    let arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        let args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }
    return arr;
}

// https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
export function transposeArray(array) {
    let newArray = [];
    let origArrayLength = array.length;
    let arrayLength = array[0].length;

    for(let i = 0; i < arrayLength; i++){
        newArray.push([]);
    }

    for(let i = 0; i < origArrayLength; i++){
        for(var j = 0; j < arrayLength; j++){
            newArray[j].push(array[i][j]);
        }
    }
    return newArray;
}

// https://stackoverflow.com/questions/1125292/how-to-move-cursor-to-end-of-contenteditable-entity
export function setEndOfContenteditable(contentEditableElement) {
    let range,selection;
    range = document.createRange();//Create a range (a range is a like the selection but invisible)
    range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
    range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection();//get the selection object (allows you to change selection)
    selection.removeAllRanges();//remove any selections already made
    selection.addRange(range);//make the range you have just created the visible selection
}

export function copy(thing) {
    return JSON.parse(JSON.stringify(thing))
}

export function shallowCopy(thing) {
    if (typeof thing === 'number' && isFinite(thing)) {
        return thing;
    }
    else {
        return thing.slice();
    }
}

export function makeGrid() {
    let numStuff = 54;
    let ctx = xxx.getContext('2d');
    for (let i = 0; i < numStuff; i++) {
        let coordY = 540.5 - (i - 16) * 20 + 20 * 20 / 2;
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.moveTo(0, coordY-1);
        ctx.lineTo(1600, coordY-1);
        ctx.stroke();
    }
}

// https://stackoverflow.com/questions/1500260/detect-targetUrls-in-text-with-javascript
// https://stackoverflow.com/questions/4907843/open-a-targetUrl-in-a-new-tab-and-not-a-new-window-using-javascript
// https://stackoverflow.com/questions/1070760/javascript-function-in-href-vs-onclick
// https://stackoverflow.com/questions/9643311/pass-string-parameter-in-an-onclick-function
export function linkify(text) {
    var targetUrlRegex =/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(targetUrlRegex, function(targetUrl) {
        a = ('<a href="' + targetUrl + '" onclick = "openInNewTab(\'' + targetUrl + '\'); return false;">' + targetUrl + '</a>');
        return a;
    });
}

export function openInNewTab(targetUrl) {
    var win = window.open(targetUrl, '_blank');
    win.focus();
}

// https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
export function transpose(array2d) {
    return array2d[0].map((col, i) => array2d.map(row => row[i]));
}

export function getTextDim(innerHTML, fontSize) {

    let tmpDiv = document.createElement('div');
    tmpDiv.id = "Test";
    tmpDiv.innerHTML = innerHTML;
    mapDiv.appendChild(tmpDiv);

    var test = document.getElementById("Test");
    test.style.fontFamily = 'Roboto';
    test.style.fontSize = fontSize + 'px';
    var height = (test.clientHeight + 1);
    var width = (test.clientWidth + 1);

    var element = document.getElementById("Test");
    element.parentNode.removeChild(element);

    return width + 2;
}

export function getEquationDim (content) {

    let tmpDiv = document.createElement('div');
    tmpDiv.id = "Test";
    tmpDiv.innerHTML = katex.renderToString(getLatexString(content), {throwOnError: false});
    tmpDiv.style.fontFamily = 'Roboto';
    tmpDiv.style.fontSize = 14 + 'px';
    mapDiv.appendChild(tmpDiv);

    let dim = {
        w: tmpDiv.childNodes[0].offsetWidth,
        h: tmpDiv.childNodes[0].offsetHeight,
    };

    var element = document.getElementById("Test");
    element.parentNode.removeChild(element);

    return dim;
}

// dec2hex :: Integer -> String
export function dec2hex (dec) {
    return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
export  function genHash (len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('')
}

export function isOdd(num) { return num % 2;}

export function getLatexString(rawString) {
    return '\\LARGE ' + rawString.substring(2, rawString.length - 2).replace(/\s/g, '')
}

// https://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
export function subsref(obj, path) {  // obj,['1','2','3'] -> ((obj['1'])['2'])['3']
    return path.length ? subsref(obj[path[0]], path.slice(1)) : obj
}
// https://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
export function subsasgn(obj, path, value) {
    let pathEnd = path.pop();
    for(let i = 0; i < path.length; i++) {
        obj = obj[path[i]] = obj[path[i]] || []; // I am a genius
    }
    obj[ pathEnd ] = value;
}

export function isMouseInsideRectangle(centerX, centerY, selfW, selfH) {
    let x = lastEvent.ref.pageX - getDim().lw + document.getElementById('mapDiv').scrollLeft + 17/2;
    let y = lastEvent.ref.pageY - getDim().uh + document.getElementById('mapDiv').scrollTop ;

    let leftX =     centerX - selfW/2;
    let rightX =    centerX + selfW/2;
    let topY =      centerY + selfH/2;
    let bottomY =   centerY - selfH/2;

    return x > leftX &  x < rightX && y < topY && y > bottomY;
}
