// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('act_res')

// 云函数入口函数
exports.main = async (event, context) => {
  let act_id=event.act_id
  let res_phone=event.res_phone
  let res_name=event.res_name

  return await DB
  .add({
    data:{
      act_id:act_id,
      res_phone:res_phone,
      res_name:res_name,
      isChecked:false
    }
  })
}