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

  try {
    const collection = db.collection('marx-user')
    // 先检查是否已经登陆了火星
    const userQuery = await collection.doc(event._id)
    const res = await userQuery.get()
    if (!res.data) return createResponse('未找到用户', 404)
    if (res.data.landed) {
      return createResponse('用户已经成功登陆过火星', 400)
    }
    // 查询当前已登陆人数
    const {
      total
    } = await collection.where({
      landed: true
    }).count()
    // 记录排名
    let rank = total + 1
    const updateData = {
      landed: true,
      landedDate: new Date(),
      rank: rank,
    }
    await userQuery.update({
      data: updateData
    })

    return createResponse('用户登陆火星成功', 201, updateData)
  } catch (err) {
    log({
      errMsg: '更新用户数据失败',
      error: err
    })
    return createResponse('更新用户数据失败', 500)
  }
}