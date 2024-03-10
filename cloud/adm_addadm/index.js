// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('administrator')

exports.main = async (event, context) => {
  // let account=event.account
  let password=event.password
  let name=event.name
  let gender=event.gender
  let phone=event.phone

  return await DB
  .add({
    data:{
      // account:account,
      password: password,
      name: name,
      gender: gender,
      phone: phone,
    }
  })
}