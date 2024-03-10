// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('request');

// 云函数入口函数
exports.main = async (event, context) => {
  let level=event.level;
  let type=event.type;

  if(type=='全部类别') {
    return await DB
    .where({
      level:level
    })
    .orderBy('isUrgent','desc')
    .get({})
  } else {
    return await DB
    .where({
      level:level,
      type:type
    })
    .orderBy('isUrgent','desc')
    .get({})
  }

}