// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('administrator');

// 云函数入口函数
exports.main = async (event, context) => {
  let id=event.id
  let password=event.password
  let name=event.name
  let gender=event.gender
  let phone=event.phone

  return await DB.where({
    _id: id
  }).update({
  data:{
    phone:phone,
    password: password,
    name: name,
    gender: gender,
  }
  })
}