export function upperFirst(str) {
  return str[0].toUpperCase() + str.substring(1, str.length);
}

export function changeGenero(srt) {
  return str.substring(0, str.length - 1) + 'a';
}

export function validRules(value, rules) {
  for (let rule of rules) {
    if (! (rule(value) === true)) return false;
  }
  return true;
}

export function validObject(original, rules) {
  for(let att in rules) {
    if (typeof original[att] == 'object') return validObject(original[att], rules[att]);
    if (!validRules(original[att], rules[att])) return false;
  }
  return true;
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function round(numero, decimales) {
  if (!numero) return 0;
  let factor = Math.pow(10, decimales);
  return Math.round(numero * factor) / factor;
}

export function deepEqual(a,b) {
  if( (typeof a == 'object' && a != null) &&
      (typeof b == 'object' && b != null) )
  {
     let count = [0,0];
     for( let key in a) count[0]++;
     for( let key in b) count[1]++;
     if( count[0]-count[1] != 0) {return false;}
     for( let key in a)
     {
       if(!(key in b) || !deepEqual(a[key],b[key])) {return false;}
     }
     for( let key in b)
     {
       if(!(key in a) || !deepEqual(b[key],a[key])) {return false;}
     }
     return true;
  }
  else
  {
     return a === b;
  }
}

export function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {type:mimeString});
}