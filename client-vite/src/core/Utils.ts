// @ts-nocheck

export function arrayValuesSame(array) {
  let first = JSON.stringify(array[0]);
  for (let i = 1; i < array.length; i++) {
    if (JSON.stringify(array[i]) !== first) {
      return [false, null];
    }
  }
  return [true, JSON.parse(array[0])];
}

export function arrayValuesSameSimple(array) {
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

export function copy(thing) {
  return JSON.parse(JSON.stringify(thing))
}

export function shallowCopy(thing) {
  if (typeof thing === 'number' && isFinite(thing)) {
    return thing;
  } else {
    return thing.slice();
  }
}

export function isUrl (string) {
  try { return Boolean(new URL(string)); }
  catch(e){ return false; }
}

// https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
export function transpose(array2d) {
  return array2d[0].map((col, i) => array2d.map(row => row[i]));
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
  return '\\Large ' + rawString.substring(2, rawString.length - 2).replace(/\s/g, '')
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

export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

export const isEqual = (obj1, obj2) => {
  return JSON.stringify(obj1)===JSON.stringify(obj2)
}
