// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db=cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  let phone=event.phone
  let card=event.card //卡的数量
  let level=event.level //请求卡的等级

  const _ = db.command

  if(level=="初级") {
    return await db.collection('resident').where({
      phone:phone
    }).update({
      data:{
        primary_card:_.inc(card)
      }
    })
  } else if(level=="中级") {
    return await db.collection('resident').where({
      phone:phone
    }).update({
      data:{
        middle_card:_.inc(card)
      }
    })
  } else if(level=="高级") {
    return await db.collection('resident').where({
      phone:phone
    }).update({
      data:{
        advanced_card:_.inc(card)
      }
    })
  }
}