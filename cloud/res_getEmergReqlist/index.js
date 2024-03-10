// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('request');

// 随机找一个紧急的数据
exports.main = async (event, context) => {
  return DB.aggregate().sample({
    size: 1
  }).match({
    isUrgent: true
  }).end()

}