// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let phone=event.phone;
  const db = cloud.database()

  return await db.collection('obj_res')
  .aggregate()
  .lookup({
    from: 'object',
    localField: 'obj_id',
    foreignField: '_id',
    as: 'obj',
  })
  .match({
    res_phone:phone,
  })
  .end()
}