// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('account_book')

// 云函数入口函数
exports.main = async (event, context) => {
  let book_event=event.book_event
  let book_amount=event.book_amount

  return await DB
  .add({
    data:{
      event:book_event,
      amount:book_amount,
      time:new Date()
    }
  })
}