// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let id=event.id
  let num=event.number

  const _ = db.command
  return await db.collection('activity').where({
    _id: id
  }).update({
  data:{
    number:_.inc(num)
  }
  })
}