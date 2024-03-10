// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('appeal')

// 云函数入口函数
exports.main = async (event, context) => {
  let req_id=event.req_id
  let res_phone=event.res_phone
  let helper_phone=event.helper_phone
  let content=event.content
  let help_id=event.help_id

  return await DB
  .add({
    data:{
      req_id:req_id,
      res_phone:res_phone,
      helper_phone:helper_phone,
      help_id:help_id,
      content:content,
      time:new Date()
    }
  })
}