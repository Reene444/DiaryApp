const appdata=getApp().globalData
const genTrans=require("../utils/ObjTransactionHelp.js")
const card={
  'primary_card':"初级",
  'middle_card':"中级",
  'advanced_card':"高级"
}
/**
 * function:购买请求卡，更新居民信息
 * @value 请求卡类型：初，中，高
 */
async function pay_for_card(value){
  var amount=appdata.res_amount
  let res=await getSetting()
  let needXin=res[value]
  console.log(value)
  console.log(value,":",needXin)
  //判断请求卡。。。
  var extra={}
  if(value=='advanced_card')
  {
    extra[value]=parseInt(parseInt(appdata.res_advanced_card)+1);
    appdata.res_advanced_card=parseInt(parseInt(appdata.res_advanced_card)+1);
    console.log(appdata.res_advanced_card)
  }
  if(value=='middle_card')
  {
    extra[value]=parseInt(parseInt(appdata.res_middle_card)+1);
    appdata.res_middle_card=parseInt(parseInt(appdata.res_middle_card)+1);
  }
  if(value=='primary_card')
  {
    extra[value]=parseInt(parseInt(appdata.res_primary_card)+1);
    appdata.res_primary_card=parseInt(parseInt(appdata.res_primary_card)+1);
    console.log(appdata.res_primary_card)
  }
  appdata.res_amount=parseFloat(parseFloat(amount)-parseFloat(needXin))
  console.log("extra",extra)
  return await new Promise((resolve,reject)=>{
    if(amount<needXin)reject(false)
    else{
      //修改居民信息
      wx.cloud.callFunction({
        name:'com',
        data:{
          type:'update',
          collection:'resident',
          myData:{
            amount:parseFloat(parseFloat(amount)-parseFloat(needXin)),
            ...extra
          },
          myWhere:{
            phone:appdata.res_phone
          }
        },
        success(res){
          console.log("居民请求卡购买成功",res)
          //生成交易记录
          var data={
            affair:"购买"+card[value]+"请求卡",
            amount:parseFloat(needXin),
            method:"馨币",
            time:Date(),
            type:false,
            user:appdata.res_phone
          }
          genTrans.genTrans(data)

          console.log(appdata.res_primary_card)
          console.log(appdata.res_amount)
          resolve(true)
        },
        failed(res){
          console.log("居民请求卡购买失败",res)
          reject(false)
        }
      })
    }
  })
}
/**
 * function:获得请求卡兑换的馨币
 * @value 请求卡类型：初，中，高
 */
async function getSetting(){
    return await new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name:'com',
        data:{
          type:'get',
          collection:'setting',
          myWhere:{
            id:0
          }
        },
        success(res){
          console.log("setting获取成功",res)
          resolve(res.result.data[0])
        },
        failed(res){
          console.log("setting获取失败",res)
          resject(res)
        }
      })
    })
}
/**
 * function:给馨币充值
 * @value 馨币充值数额
 */
async function recharge(value){
  var user=appdata.res_phone
  var newamount=parseFloat(appdata.res_amount)+parseFloat(value)
  appdata.res_amount=newamount//本地缓存
  return await new Promise((resolve,reject)=>{
    //修改居民信息中的馨币值
    wx.cloud.callFunction({
      name:'com',
      data:{
        type:'update',
        collection:'resident',
        myWhere:{
          phone:user
        },
        myData:{
          amount:newamount
        }
      },
      success(res){
        console.log("馨币充值成功")
         //生成交易记录
         var data={
          affair:"充值馨币",
          amount:parseFloat(value),
          method:"馨币",
          time:Date(),
          type:true,
          user:appdata.res_phone
        }
        genTrans.genTrans(data)

        resolve(true)
      },
      failed(res){
        console.log("馨币充值失败")
        reject(false)
      }
    })
  })
}

module.exports={
  pay_for_card:pay_for_card,
  recharge:recharge
}