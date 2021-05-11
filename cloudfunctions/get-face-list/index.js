// 云函数入口文件
const cloud = require("wx-server-sdk");
const {
  client,
  models
} = require("./client");
const {
  activityId
} = require("./conf");
const {
  EnumGender
} = require("./enum");
const {
  getLogger,
  createResponse
} = require('./util')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const log = getLogger(cloud, 'get-face-list');

const getMaterialList = (params) => {
  let req = new models.DescribeMaterialListRequest();
  req.from_json_string(params);

  return new Promise((resolve, reject) => {
    client.DescribeMaterialList(req, function (errMsg, response) {
      if (errMsg) {
        reject(errMsg);
        return;
      }
      resolve(JSON.parse(response.to_json_string()));
    });
  });
};

// 云函数入口函数
exports.main = async (event) => {
  let {
    gender = EnumGender.MALE, limit = 2
  } = event;
  let offset = 0; // 性别女性的话, 偏移为0
  if (gender === EnumGender.MALE) {
    offset = 2; // 性别女性的话, 偏移为2
  }
  const params = {
    ActivityId: activityId,
    Limit: limit,
    Offset: offset
  };

  try {
    return await getMaterialList(JSON.stringify(params));
  } catch (err) {
    log({
      error: err,
      errMsg: '获取模板列表失败'
    })
    return createResponse('获取模板列表失败', 404, err)
  }
};