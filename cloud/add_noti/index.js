// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('notification')

// 云函数入口函数
exports.main = async (event, context) => {
  let res_phone=event.res_phone
  let time=new Date()
  let content=event.content
  let type=event.type

  return await DB
  .add({
    data:{
      res_phone:res_phone,
      time:time,
      content:content,
      type:type,
      isChecked:false, //标记未被查看过
    }
  })
}