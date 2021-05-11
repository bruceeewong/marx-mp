// 云函数入口文件
const cloud = require("wx-server-sdk");
const { createResponse } = require("./util");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

const createLog = (
  openid = "",
  func = "",
  level = "ERROR",
  detail = null,
  logTime = new Date()
) => {
  return {
    openid,
    func,
    level,
    detail,
    logTime,
  };
};

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  const {
    func = "funcName",
    collectionName = "marx-log",
    level,
    detail,
    logTime,
  } = event;

  const log = createLog(wxContext.OPENID, func, level, detail, logTime);

  const collection = db.collection(collectionName);
  try {
    await collection.add({
      data: log,
    });
    return createResponse("日志上报成功", 0, null);
  } catch (err) {
    return createResponse("日志上报失败", -1, err);
  }
};
