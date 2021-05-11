// 云函数入口文件
const cloud = require("wx-server-sdk");
const { getLogger, createResponse } = require("./util");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();
const _ = db.command;
const log = getLogger(cloud, "update-avatar");

// 云函数入口函数
exports.main = async (event, context) => {
  const { fileId } = event;
  if (!fileId) return createResponse("fileId云空间文件id参数必传", 400);

  const wxContext = cloud.getWXContext();
  const collection = db.collection("marx-user");
  try {
    const res = await collection
      .where({
        _openid: wxContext.OPENID,
      })
      .get();

    if (res.data.length === 0) {
      return createResponse("用户未注册", 400);
    }

    // 插入fileID字段
    const userInfo = res.data[0];

    await collection.doc(userInfo._id).update({
      data: {
        fileId: fileId,
      },
    });
    return createResponse("更新用户形象成功", 200);
  } catch (err) {
    log({
      errMsg: "更新用户形象失败",
      error: err,
    });
    return createResponse("更新用户形象失败", 500);
  }
};
