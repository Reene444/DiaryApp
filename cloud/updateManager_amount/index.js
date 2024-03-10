// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let amount=event.amount

  const _ = db.command
  return await db.collection('administrator').where({
    _id: '5b049cc86211b62b0d581e265823e5ca'
  }).update({
  data:{
    warmth_amount:_.inc(amount)
  }
  })
}