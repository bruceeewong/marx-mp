// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
  createResponse,
  log
} = require('./util')
cloud.init({
  env: cloud.CURRENT_ENV
})

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event) => {
  if (!event._id) return createResponse('参数缺少_id主键', 400, event)

  const validProps = ['name', 'gender', 'earthCountry', 'marsArea', 'landed', 'landedDate']

  const updateData = {}
  validProps.forEach(prop => {
    if (event[prop]) {
      updateData[prop] = event[prop]
    }
  })

  try {
    await db.collection('marx-user')
      .doc(event._id)
      .update({
        data: updateData
      })
    return createResponse('更新用户数据成功', 201)
  } catch (err) {
    log({
      errMsg: '更新用户数据失败',
      error: err
    })
    return createResponse('更新用户数据失败', 500)
  }
}