// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('setting')

// 云函数入口函数
exports.main = async (event, context) => {
  let primary=parseInt(event.primary)
  let middle=parseInt(event.middle)
  let advanced=parseInt(event.advanced)

  return await DB
  .where({
    id:0,
  })
  .update({
    data:{
      primary_card:primary,
      middle_card:middle,
      advanced_card:advanced
    }
  })
}