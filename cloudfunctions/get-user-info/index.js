// 云函数入口文件
const cloud = require("wx-server-sdk");
const { createResponse, getLogger } = require("./util");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = getLogger(cloud, "marx-cloud-log");

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  const db = cloud.database();

  const collection = db.collection("marx-user");

  const res = await collection
    .where({
      _openid: wxContext.OPENID,
    })
    .get();

  if (res.data.length === 0) {
    return createResponse("未找到用户", 404);
  } else {
    let userInfo = res.data[0];
    // 生成临时头像url
    const { fileList } = await cloud.getTempFileURL({
      fileList: [userInfo.fileId],
    });
    userInfo = {
      ...userInfo,
      avatarUrl: fileList[0].tempFileURL,
    };
    return createResponse("ok", 200, userInfo);
  }
};
