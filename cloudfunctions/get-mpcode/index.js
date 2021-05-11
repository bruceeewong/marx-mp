const cloud = require('wx-server-sdk');
const {
  createResponse,
  getLogger
} = require('./util');
const log = getLogger(cloud, 'get-mpcode');

cloud.init({
  env: cloud.CURRENT_ENV
});

exports.main = async (event, context) => {
  const {
    path,
    width = 400,
    is_hyaline = true,
    line_color = {
      "r": 0,
      "g": 0,
      "b": 0
    }
  } = event;

  if (!path) {
    return createResponse('缺少path参数', 400);
  }
  try {
    const params = {
      path,
      width,
      is_hyaline,
      line_color
    };
    log({
      msg: '请求二维码参数',
      params
    })
    const result = await cloud.openapi.wxacode.get(params)
    return createResponse('生成小程序码成功', 200, result);
  } catch (err) {
    log({
      errMsg: '',
      error: err
    })
    return createResponse('生成小程序码失败', 500);
  }
}