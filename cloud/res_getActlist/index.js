// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('activity');

// 云函数入口函数
exports.main = async (event, context) => {
  let user_id=user_id;

 
    return await DB
    .where({
      user_id:user_id
    })
    .get({})
  
  }


