// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('announcement');

// 云函数入口函数
exports.main = async (event, context) => {
  return await DB
  // .orderBy('magnitude','desc')
  .orderBy('time','desc')
  .get({})
}