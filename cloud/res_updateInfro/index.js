// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let phone=String(event.oldphone);
  let newphone=event.newphone
  console.log(phone)
try{
  return await db.collection('resident').where({
    phone:phone
  }).update({
    data:{
      phone:newphone
    }
  })
}catch(e){
  console.error(e)
}
}