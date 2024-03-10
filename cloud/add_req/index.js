// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('diary')

// 云函数入口函数
exports.main = async (event, context) => {
  let title=event.title
  let petitioner=event.petitioner
  let content=event.content
  let time_limit=event.time_limit

  return await DB
  .add({
    data:{
      user_id:user_id,
      title: title,
      content: content,
      time_limit:new Date(),

    }
  })
}