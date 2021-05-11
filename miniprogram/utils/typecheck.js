class TypeCheck {
  static isNumber(arg) {
    return typeof arg === "number";
  }
  static isString(arg) {
    return typeof arg === "string";
  }
  static isUndefined(arg) {
    return typeof arg === "undefined";
  }

  static isNull(arg) {
    return Object.prototype.toString.call(arg) === "[object Null]";
  }
  static isObject(arg) {
    return Object.prototype.toString.call(arg) === "[object Object]";
  }

  static isInteger(arg) {
    return Number.isInteger(arg);
  }
  static isError(arg) {
    return arg instanceof Error;
  }
}

module.exports = TypeCheck;