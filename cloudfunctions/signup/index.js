// 云函数入口文件
const cloud = require("wx-server-sdk");
const Joi = require("@hapi/joi");
const { createResponse, getLogger } = require("./util");

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = getLogger(cloud, "signup");

const db = cloud.database();

const reqSchema = Joi.object({
  name: Joi.string(),
  gender: Joi.string(),
  earthCountry: Joi.string(),
  marsArea: Joi.string(),
  userInfo: Joi.object({
    appId: Joi.string(),
    openId: Joi.string(),
  }),
});

// 将用户注册的表单存入数据库
exports.main = async (event) => {
  const wxContext = cloud.getWXContext();

  const collection = db.collection("marx-user");

  const { error, value } = reqSchema.validate(event);
  if (error) {
    return createResponse("参数校验失败", 400, error);
  }

  try {
    const res = await collection
      .where({
        _openid: wxContext.OPENID,
      })
      .get();
    if (res.data.length > 0) {
      return createResponse("用户数据已经存在", 302, null);
    }
  } catch (err) {
    const res = createResponse("查询数据库出错", 500, err);
    log(res);
    return res;
  }

  try {
    const res = await collection.add({
      data: {
        _openid: wxContext.OPENID,
        _appid: wxContext.APPID,
        name: value.name,
        gender: value.gender,
        earthCountry: value.earthCountry,
        marsArea: value.marsArea,
        createTime: new Date(),
        fileId: null,
        landed: false,
        landedTime: null,
      },
    });
    return createResponse("用户数据录入成功", 200, res.data);
  } catch (err) {
    const res = createResponse("数据库插入数据出错", 500, err);
    log(res);
    return res;
  }
};
