// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('req_user')

// 云函数入口函数
exports.main = async (event, context) => {
  let req_id=event.req_id
  let phone=event.phone
  let isOfficial=event.isOfficial

  return await DB
  .add({
    data:{
      req_id:req_id,
      phone:phone,
      isOfficial:isOfficial,
      start_time:new Date(),
      end_time:new Date(),
      recordList:[],
      picture:{}
    }
  })
}