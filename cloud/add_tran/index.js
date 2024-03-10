// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('transaction')

// 云函数入口函数
exports.main = async (event, context) => {
  let user=event.user
  let time=new Date()
  let affair=event.affair
  let amount=event.amount
  let type=event.type

  return await DB
  .add({
    data:{
      user:user,
      time:time,
      affair:affair,
      amount:amount,
      type:type,
    }
  })
}