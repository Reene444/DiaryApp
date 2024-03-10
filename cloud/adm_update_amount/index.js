// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('administrator')

// 云函数入口函数
exports.main = async (event, context) => {
  let amount=parseInt(event.amount)

  return await DB
  .where({
    _id:'5b049cc86211b62b0d581e265823e5ca',
  })
  .update({
    data:{
      warmth_amount:amount
    }
  })
}