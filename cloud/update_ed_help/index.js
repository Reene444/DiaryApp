// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let id=event.id

  return await db.collection('req_user').where({
    _id:id
  }).update({
  data:{
    end_time:new Date()
  }
  })
}