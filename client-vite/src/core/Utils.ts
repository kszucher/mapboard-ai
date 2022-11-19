// @ts-nocheck

export const arrayValuesSame = (array) => {
  let first = JSON.stringify(array[0]);
  for (let i = 1; i < array.length; i++) {
    if (JSON.stringify(array[i]) !== first) {
      return [false, null];
    }
  }
  return [true, JSON.parse(array[0])];
}

export const arrayValuesSameSimple = (array) => {
  let first = JSON.stringify(array[0]);
  for (let i = 1; i < array.length; i++) {
    if (JSON.stringify(array[i]) !== first) {
      return false;
    }
  }
  return true;
}

export const createArray = (dim1, dim2) => {
  // https://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript
  return Array.from(Array(dim1), () => new Array(dim2))
}

export const transposeArray = (array) => {
  // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
  let newArray = []
  let origArrayLength = array.length
  let arrayLength = array[0].length
  for(let i = 0; i < arrayLength; i++){
    newArray.push([]);
  }
  for(let i = 0; i < origArrayLength; i++){
    for(let j = 0; j < arrayLength; j++){
      newArray[j].push(array[i][j])
    }
  }
  return newArray
}

export const copy = (thing) => {
  return JSON.parse(JSON.stringify(thing))
}

export const shallowCopy = (thing) => {
  if (typeof thing === 'number' && isFinite(thing)) {
    return thing;
  } else {
    return thing.slice();
  }
}

export const isUrl = (string) => {
  try { return Boolean(new URL(string)); }
  catch(e){ return false; }
}

export const transpose = (array2d) => {
  // https://stackoverflow.com/questions/17428587/transposing-a-2d-array-in-javascript
  return array2d[0].map((col, i) => array2d.map(row => row[i]));
}

// dec2hex :: Integer -> String
export const dec2hex = (dec) => {
  return ('0' + dec.toString(16)).substr(-2)
}

// generateId :: Integer -> String
export const genHash = (len) => {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('')
}

export const isOdd = (num) => {
  return num % 2
}

export const getLatexString = (rawString) => {
  return '\\Large ' + rawString.substring(2, rawString.length - 2).replace(/\s/g, '')
}

export const subsref = (obj, path) => {
  // https://stackoverflow.com/questions/6393943/convert-javascript-string-in-dot-notation-into-an-object-reference
  // obj,['1','2','3'] -> ((obj['1'])['2'])['3']
  try {
    return path.length ? subsref(obj[path[0]], path.slice(1)) : obj
  } catch {
    return undefined
  }
}

export const subsasgn = (obj, path, value) => {
  // https://stackoverflow.com/questions/5484673/javascript-how-to-dynamically-create-nested-objects-using-object-names-given-by
  let pathEnd = path.pop();
  for(let i = 0; i < path.length; i++) {
    obj = obj[path[i]] = obj[path[i]] || []; // I am a genius
  }
  obj[ pathEnd ] = value;
}

export const isEqual = (obj1, obj2) => {
  return JSON.stringify(obj1)===JSON.stringify(obj2)
}

export const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
