// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('activity');

// 云函数入口函数
exports.main = async (event, context) => {
  let phone=event.phone;

  return await DB
  .where({
    promoter:phone
  })
  .get({})
}