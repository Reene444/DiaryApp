// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('notification');

// 云函数入口函数
exports.main = async (event, context) => {
  let type=event.type;
  let phone=event.phone;

  return await DB
  .where({
    type:type,
    res_phone:phone
  })
  .orderBy('time','desc')
  .get({})

}