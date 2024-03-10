// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('activity');

// 云函数入口函数
exports.main = async (event, context) => {
  let len=event.len
  return await DB
  .where({
    state:"审核中"
  })
  .skip(len)
  .limit(20)
  .get({})
}