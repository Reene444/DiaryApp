// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('req_user');

// 云函数入口函数
exports.main = async (event, context) => {
  let id=event.id
  let score=event.score
  let award=event.award
  let evaluation=event.evaluation
  let base_amount=event.base_amount

  return await DB.where({
    _id: id
  }).update({
    data:{
      score:score,
      award:award,
      evaluation:evaluation,
      base_amount:base_amount
    }
  })
}