Object.prototype.mycreate = function(proto, propertiesObject) {
  function F() {};
  F.prototype = proto;
  const obj = new F();
  if(propertiesObject) {
    Object.defineProperties(obj, propertiesObject);
  }
  return obj
}

