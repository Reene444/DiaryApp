// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('communication');

// 云函数入口函数
exports.main = async (event, context) => {
  let type=event.type
  return await DB
  .where({
    type:type
  })
  .orderBy('ischecked','asc')
  .get({})
}