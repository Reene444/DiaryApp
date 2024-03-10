// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
const DB=cloud.database().collection('administrator');

// 云函数入口函数
exports.main = async (event, context) => {
  let len=event.len
  let phone=event.phone
  const _ = db.command

  return await DB
  .where({
    phone: _.neq(phone)
  })
  .skip(len)
  .limit(20)
  .get({})
}