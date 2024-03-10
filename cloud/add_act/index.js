// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('activity')

// 云函数入口函数
exports.main = async (event, context) => {
  let title=event.title
  let user_id=event.user_id
  let description=event.description
  let start_time=new Date(event.start_time)
  let location=event.location
  let level=event.level


  return await DB
  .add({
    data:{
      title: title,
      user_id: user_id,
      description: description,
      start_time: start_time,
      location:location,
      level:level,
   
    }
  })
}