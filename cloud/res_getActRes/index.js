// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('act_res');

// 云函数入口函数
exports.main = async (event, context) => {
  let act_id=event.act_id
  return await DB
  .where({
    act_id:act_id
  })
  .get({})
}