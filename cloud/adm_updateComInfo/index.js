// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('communication')

// 云函数入口函数
// 修改状态为已确认
exports.main = async (event, context) => {
  let id=event.id
  let reply=event.reply

  return await DB.where({
    _id: id
  }).update({
  data:{
    ischecked:true,
    reply:reply
  }
  })
}