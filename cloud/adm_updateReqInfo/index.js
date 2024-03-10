// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('request');

// 云函数入口函数
exports.main = async (event, context) => {
  let id=event.id
  let title=event.title
  let content=event.content
  let time_limit=event.time_limit
  let demand=event.demand
  let level=event.level
  let type=event.type
  let settle_way=event.settle_way
  let amount=parseInt(event.amount)
  let isUrgent=event.isUrgent

  return await DB.where({
    _id: id
  }).update({
  data:{
    title:title,
    content:content,
    time_limit:time_limit,
    demand:demand,
    level:level,
    type:type,
    settle_way:settle_way,
    amount:amount,
    isUrgent:isUrgent
  }
  })
}