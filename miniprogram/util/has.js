const has = function (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
export default has;
