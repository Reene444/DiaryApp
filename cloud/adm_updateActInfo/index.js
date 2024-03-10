// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB=cloud.database().collection('activity');

const stringToDate = function(str) {
  str = str.replace(/-/g, "/");
  return new Date(str);
}

// 云函数入口函数
exports.main = async (event, context) => {
  let id=event.id
  let name=event.name
  let promoter=event.promoter
  let description=event.description
  let start_time=new Date(event.start_time)
  let location=event.location
  let scale=event.scale
  let limitation=event.limitation
  let state=event.state
  let epi_prevention=event.epi_prevention
  let amount=event.amount
  return await DB.where({
    _id: id
  }).update({
  data:{
    name: name,
    promoter: promoter,
    description: description,
    start_time: start_time,
    location:location,
    scale:scale,
    limitation:limitation,
    state:state,
    epi_prevention:epi_prevention,
    amount:amount
  }
  })
}