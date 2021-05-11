/**
 * 判断对象实例是否含某属性
 * @param {object}} obj
 * @param {string} key
 */
const has = (obj, key) => {
  return Object.prototype.hasOwnProperty.call(obj, key);
};

/**
 * 生成统一返回结构
 * @param {string} msg
 * @param {number} code
 * @param {any} data
 */
const createResponse = (msg = "ok", code = 200, data = null) => {
  return {
    msg,
    code,
    data,
  };
};

/**
 * 日志记录
 * @param {*} cloud 云环境实例
 * @param {string} func 要打日志的云函数名称
 * @param {string} collectionName 要存放的数据库
 */
const getLogger = (
  cloud,
  func = "funcName",
  collectionName = "marx-cloud-log"
) => {
  return (payload) => {
    return cloud.callFunction({
      name: "log",
      data: {
        func,
        collectionName,
        detail: payload,
      },
    });
  };
};

module.exports = {
  has,
  createResponse,
  getLogger,
};
