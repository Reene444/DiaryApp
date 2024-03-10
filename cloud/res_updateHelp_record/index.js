// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('req_user');

// 云函数入口函数
exports.main = async (event, context) => {
  let id=event.id
  let new_record=event.new_record

  const _=cloud.database().command

  return await DB.where({
    _id: id
  }).update({
    data:{
      recordList:_.push(new_record),
    }
  })
}