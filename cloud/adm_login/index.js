// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection("administrator")

// 云函数入口函数
exports.main = async (event, context) => {
  return await DB.where({
    _id:event.id,
    // account: event.account,
    password: event.password
    }).get();
  
  // adminInfo = adminInfo.data[0]

  // if(adminInfo._id=='5b049cc86211b62b0d581e265823e5ca') { //总管的id值不变
  //     return {
  //     data:adminInfo,
  //     isManager:true
  //   }
  // } else {
  //   return {
  //     data:adminInfo,
  //     isManager:false
  //   }
  // }

}