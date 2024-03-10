// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let phone=event.phone
  let amount=parseFloat(event.amount)

  const _ = db.command
  return await db.collection('resident').where({
    phone: phone
  }).update({
  data:{
    amount:_.inc(amount)
  }
  })
}