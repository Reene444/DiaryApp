// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const _ = db.command
  if (typeof event.myData == 'string') {
    console.log(event.myData)
    event.myData = eval('(' + event.myData + ')');
  }
  if (typeof event.myWhere == 'string') {
    console.log(event.myWhere)
    event.myData = eval('(' + event.myWhere + ')');
  }
  const wxContext = await cloud.getWXContext()
  const type=event.type
  try {
      //插入
    if(type=='add')
    return await db.collection(event.collection).add({
      data: {
        ...event.myData
      }
    })
    //更新
    if(type=='update')
    return await db.collection(event.collection).where({
        ...event.myWhere
      }).update({
        data: {
          ...event.myData
        }
      })

      //查询
      if(type=='get')
      return await db.collection(event.collection).where({
        ...event.myWhere
      }).get({})

      //删除
      if(type=='delete')
      return await db.collection(event.collection).where({
        ...event.myWhere
      }).remove({})

  } catch (e) {
    console.log(e)
  }

}