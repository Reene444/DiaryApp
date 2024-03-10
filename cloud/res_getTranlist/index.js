// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('transaction');

// 云函数入口函数
exports.main = async (event, context) => {
  let type=event.type;
  let user=event.user;

  return await DB
  .where({
    type:type,
    user:user
  })
  .orderBy('time','desc')
  .get({})

}