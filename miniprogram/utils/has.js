const has = function (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
};
module.exports = has;
