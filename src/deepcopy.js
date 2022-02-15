function deepCopy(obj) {
  if(typeof obj !== 'object') {
    return obj;
  };

  let cloneObj = obj.constructor=== Array ? [] : {};
  for(let property in obj) {
    cloneObj[property] = typeof obj[property] === 'object' ? deepCopy(obj[property]) : obj[property];
  }
  return cloneObj;
}