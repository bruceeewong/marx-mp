// 云函数入口文件
const cloud = require('wx-server-sdk')
const {
  createResponse,
  getLogger
} = require('./util')

const log = getLogger(cloud, 'get-landed-user')

cloud.init({
  env: cloud.CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    skip = 0, limit = 10, orderBy = 'landedDate', orderMethod = 'asc'
  } = event

  // 统计用户中，带有 landed: true 的标识的用户，返回用户名注册信息
  const landedUserQuery = db.collection('marx-user')
    .field({
      name: true,
      gender: true,
      fileId: true,
      earthCountry: true,
      marsArea: true,
      landedDate: true,
    })
    .where({
      landed: true
    })

  const {
    total
  } = await landedUserQuery.count()
  const dataRes = await landedUserQuery
    .skip(skip)
    .orderBy(orderBy, orderMethod)
    .limit(limit)
    .get()

  // 将所有用户的fileId换取临时图片链接
  let userData = dataRes.data
  const userAvatarFileIdList = userData.map(item => item.fileId)
  const {
    fileList
  } = await cloud.getTempFileURL({
    fileList: userAvatarFileIdList
  });

  // 依次塞进原数组中
  userData = userData.map((item, index) => {
    return {
      ...item,
      avatarUrl: fileList[index].tempFileURL
    }
  })

  const response = {
    total: total,
    users: userData
  }

  return createResponse('返回已登陆火星的用户', 200, response)
}