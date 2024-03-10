// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('announcement')

// 云函数入口函数
exports.main = async (event, context) => {
  let title=event.title
  let content=event.content
  let magnitude=event.magnitude
  let time=new Date(event.time)

  return await DB
  .add({
    data:{
      title:title,
      content:content,
      magnitude:magnitude,
      time:time
    }
  })
}