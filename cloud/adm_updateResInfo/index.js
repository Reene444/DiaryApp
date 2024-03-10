// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('resident')

// 云函数入口函数
exports.main = async (event, context) => {
  let id=event.id
  let phone=event.phone
  let password=event.password
  let name=event.name
  let gender=event.gender
  let birthday=new Date(event.birthday)
  console.log(birthday)
  let credit_score=parseInt(event.credit_score)
  let amount=event.amount
  let primary_card=event.primary_card
  let middle_card=event.middle_card
  let advanced_card=event.advanced_card

  return await DB.where({
    _id: id
  }).update({
  data:{
    phone: phone,
    password: password,
    name: name,
    gender: gender,
    birthday:birthday,
    credit_score:credit_score,
    amount:amount,
    primary_card:primary_card,
    middle_card:middle_card,
    advanced_card:advanced_card
  }
  })
}