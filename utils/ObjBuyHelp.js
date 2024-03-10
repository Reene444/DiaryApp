const app=getApp()
const appdata=app.globalData
const genTrans=require("./ObjTransactionHelp.js")
const dateHelp=require("./DateHelp.js")
const DateHelp = require("./DateHelp.js")

/**
 * function:物品 状态更新
 * @obj 物品
 * @state 物品要更新的状态：销售中，待收货，已卖出;其他要更新的信息
 */
async function objStateChange(obj,newstate){
    console.log("newstate:",String(newstate))
    console.log("obj",obj)
    // if (typeof extradata == 'string') {
    //     console.log(extradata)
    //     extradata = eval('(' + extradata + ')');
    //   }
    return await new Promise((resolve,reject)=>{

       wx.cloud.callFunction({
        name:"com",
        data:{
            type:'update',
            collection:"object",
            myWhere:{
                _id:obj._id
            },
            myData:{
                state:newstate,
                // ...extradata
            }
        },
        success(res){
                resolve(true)
                console.log("物品修改状态成功",res)
        },
        failed(res){
            console.log("物品修改状态失败",res)
            reject(false)
        }
        
    })
  })

}
/**
 * function:居民收付款，更新馨币
 * @Data 物品
 */
async function pay_resChange(Data){

      if(Data.amount>appdata.res_amount) return false
      let amount=appdata.res_amount-Data.amount

      //买家支付
      return await new Promise((resolve,reject)=>
      {wx.cloud.callFunction({
          name:"com",
         data:{
           type:"update",
           collection:"resident",
          myWhere:{
              phone:Data.buyer_phone
          },
          myData:{
               amount:amount
          }  
         } ,
          success(res){
            //卖家收钱
            amount=appdata.res_amount+Data.amount
            wx.cloud.callFunction({
              name:"com",
             data:{
               type:"update",
               collection:"resident",
              myWhere:{
                  phone:Data.seller_phone
              },
              myData:{
                   amount:amount
              } 
             }
            })
            console.log("居民馨币修改成功",res)
            //存入app.globaldata中
            appdata.res_amount-=Data.amount
            resolve(true)
         },
         failed(res){
             console.log("居民修改数据失败",res)
             reject(false)
         }

      })
    }) 
  }

/**
 * function:居民取消购买退款，更新馨币
 * @Data 物品
 */
async function refund_resChange(Data){
  let amount=appdata.res_amount+Data.amount
  //买家收费
  return await new Promise((resolve,reject)=>
  {wx.cloud.callFunction({
      name:"com",
     data:{
       type:"update",
       collection:"resident",
      myWhere:{
          phone:Data.buyer_phone
      },
      myData:{
           amount:amount
      }  
     } ,
      success(res){
        //卖家支出
        amount=appdata.res_amount-Data.amount
        wx.cloud.callFunction({
          name:"com",
         data:{
           type:"update",
           collection:"resident",
          myWhere:{
              phone:Data.seller_phone
          },
          myData:{
               amount:amount
          } 
         }
        })
        console.log("居民馨币修改成功",res)
        //存入app.globaldata中
        appdata.res_amount+=Data.amount
        resolve(true)
     },
     failed(res){
         console.log("居民修改数据失败",res)
         reject(false)
     }

  })
}) 
}

  /**
   * function:生成集市消息
   * @user 买家/卖家
   * @noi 消息内容content
   */
async function noi_resChange(noi,user){
    console.log("集市数据：",DateHelp.setToday(),noi,user)
    return await new Promise((resolve,reject)=>{
        wx.cloud.callFunction({
        name:'com',
        data:{
            type:'add',
            collection:'notification',
            myData:{
                content:noi,
                res_phone:user,
                time:Date(),
                type:'集市',
                isChecked:false,
            },
        },

        success(res){
            if(res.result)
            {
                console.log("集市消息添加成功",res)
                resolve(true)         
            }
            else{
                console.log("集市消息添加失败",res)
                reject(false)
            }

        },
        failed(res){
            console.log("集市消息添加失败")
            reject(false)
        }
    })
    })
}
  /**
   * function:获得物品信息
   * @obj_id 物品ID
   */
async function getObjDetail(obj_id){
    var obj={}
    return await new Promise((resolve,reject)=>
    {

      wx.cloud.callFunction({
        name:"com",
        data:{
            type:'get',
            skip:0,
            collection:"object",
            myWhere:{
                _id:obj_id
            }
        },
        success(res){
           
            obj=res.result.data[0]
            console.log("获取物品数据成功",obj)
            resolve(obj)
        }
        ,failed(res){
            console.log("获取物品数据失败",res)
            reject(res)
        }
    })
    })
   
}

/**
 * 获取购买人手机号
 */
async function getBuyerPhone(obj_id) {
  var buyer_phone=''
  return await new Promise((resolve,reject)=>
  {
    wx.cloud.callFunction({
      name:"com",
      data:{
          type:'get',
          collection:"obj_res",
          myWhere:{
              obj_id:obj_id
          }
      },
      success(res){
         console.log(res)
         if(res.result.data==[]){
          buyer_phone=res.result.data[0].res_phone
          console.log("获取数据成功",buyer_phone)
          resolve(buyer_phone)
         }
      }
      ,failed(res){
          console.log("获取数据失败",buyer_phone)
          reject(buyer_phone)
      }
  })
  })
}

/**
 * function:确认收货
 * @obj 物品
 * @user 买家和买家 
 */
async function confirmBuy(obj,user){
    var extra={
        resPhone:user.sale_user,
        buy_resPhone:user.buy_user
    }
    return await new Promise((resolve,reject)=>{
         objStateChange(obj,"已卖出",extra).then((res)=>{
             if(res){resolve(true)}
            else{reject(false)} 
        })


    }).catch((err)=>{
        console.log(err)
    })

}
/**
 * function:卖家发货,更新为待收货
 * @obj 物品
 * @user buy_user买家,sale_user卖家
 */
async function deliverObj(obj,user){
    var extra={
        resPhone:user.sale_user,
        buy_resPhone:user.buy_user
    }
    return await new Promise((resolve,reject)=>{
      objStateChange(obj,"待收货",extra).then((res)=>{
          console.log("卖家发货")
          if(res)resolve(true)
          else reject(false)
      }) .catch((err)=>{
          console.log(err)
      })
    })
}
/**
 * function：取消购买
 * @obj_id  物品ID
 */
async function deleteBuy(obj_id){
    var obj={}
    var user={}
    getObjDetail(obj_id).then((res)=>{
      obj=res;
      user={
        buy_user:appdata.res_phone,
        sale_user:obj.resPhone
      }
      console.log("取消购买res:",res,obj_id)
    }).then(()=>{
      wx.cloud.callFunction({
      name:"com",
      data:{
        type:'update',
        collection:'object',
        myWhere:{
          _id:obj._id
        },
        myData:{
          state:"销售中",
          buy_resPhone:""
        }
      },
      success(res){
        console.log("已取消购买",res)
        //取消购买
        objStateChange(obj,"销售中",{buy_resPhone:""})
        //退馨币
        if(obj.method=="馨币"){
          genTrans.updateXin(parseInt(appdata.res_amount)+parseInt(obj.amount))
          appdata.res_amount=parseInt(appdata.res_amount)+parseInt(obj.amount)//本地缓存
        }
        //扣除诚信分10分
        deductCredit(appdata.res_phone,10)
        //生成交易记录
        genTrans.gendeleteTrans(obj,user).then((res)=>{
          console.log("取消购买",res)
          wx.showToast({
          title: '已取消购买',
          icon:'success'
        })   
        })
        //生成集市消息
        var myuser=appdata.res_phone
        var noi="您已取消购买"+obj.name+",金额为"+obj.amount+",退款至"+obj.method
        noi_resChange(noi,myuser)

      },
      failed(res){
        console.log("更新数据失败")
      }
    })
  })
}
/**
 * function:扣除诚信分
 * @user 居民 
 * @score 扣除的诚信分
 */
async function deductCredit(user,score){
  return await new Promise((resolve,reject)=>{
    var newscore=parseInt(appdata.res_credit_score)-parseInt(score)
    appdata.res_phone=newscore//微信缓存
    wx.cloud.callFunction({
      name:'com',
      data:{
        type:'update',
        collection:'resident',
        myWhere:{
          phone:user
        },
        myData:{
          credit_score:parseInt(newscore)
        }
      },
      success(res){
        console.log(user+"已扣除诚信分:"+score,res,parseInt(newscore))
        resolve(res)
      },
      failed(res){
        console.log(user+"扣除诚信分失败:"+score,res)
        reject(res)
      } 
    })
  })
} 
  module.exports={
    objStateChange:objStateChange,
    pay_resChange:pay_resChange,//付款->发货
    refund_resChange:refund_resChange,//退款
    noi_resChange:noi_resChange,//集市消息
    getObjDetail:getObjDetail,
    deliverObj:deliverObj,//发货
    confirmBuy:confirmBuy,//确认收货
    deleteBuy:deleteBuy,//取消购买
    getBuyerPhone:getBuyerPhone //获取购买人手机号
  }