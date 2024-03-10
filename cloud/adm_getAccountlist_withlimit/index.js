// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('account_book');

// 云函数入口函数
exports.main = async (event, context) => {
  let len=event.len
  return await DB
  .orderBy('time','desc')
  .skip(len)
  .limit(20)
  .get({})
}