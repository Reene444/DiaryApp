// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('object');

// 云函数入口函数
exports.main = async (event, context) => {
  let id=event.id
  let name=event.name
  let description=event.desciption
  let location=event.location
  let trading=event.trading
  let picture=event.picture
  let amount=event.amount
  let state=event.state
  let seller_phone=event.seller_phone
  let type=event.type

  return await DB.where({
    _id: id
  }).update({
  data:{
    name: name,
    description:description,
    seller_phone:seller_phone,
    amount:amount,
    location:location,
    state:state,
    type:type,
    trading:trading,
    picture:picture,
  }
  })
}