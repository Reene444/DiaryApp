const setToday=require("./DateHelp.js")
const appdata=getApp().globalData
/**
 * function:生成交易记录
 * @Data 交易记录信息
 */
async function generalTrans(Data)
{
    console.log("transData:",Data)
    // Data["time"]=setToday.setToday()
    return await new Promise((resolve,reject)=>{
        wx.cloud.callFunction({
        name:'com',
        data:{
            type:'add',
            collection:'transaction',
            myData:Data
        },
        success(res){
            console.log("生成了一笔交易记录",res)
            // wx.showToast({
            //   title: '您生成了一笔交易记录',
            //   icon:'success'
            // })
            resolve(true)
        },
        failed(res){
            console.log("交易记录生成失败",res)
            // wx.showToast({
            //     title: '交易记录生成失败',
            //     icon:'error'
            //   })
              reject(false)
        }
        
    })
})
}
/**
 * function:买家卖家都生成...交易记录
 * @Data 物品
 * @user 买家buy_user，卖家sale_user
 */
async function generalBothTrans(Data,user){

    let res1=await generalTrans(Data.myData)
    let res2=await generalTrans(Data.saleData)
    ;
   
    return await new Promise((resolve,reject)=>{
    Promise.all([res1,res2]).then((res)=>{
        // return await new Promise((resolve,reject)=>{
            if(res[0]&&res[1])resolve(true)
            else reject(false)
            console.log("bothTrans:",res[0],res[1])
        // })
    }).catch((err)=>{
        console.log("err",err)
    })
    }).catch((err)=>{
        console.log("err",err)
    })

}
/**
 * function:买家卖家都生成购买交易记录
 * @obj 物品
 * @user 买家buy_user，卖家sale_user
 */
async function generalBuyBothTrans(obj,user){
    var myData={
        affair:"购买“"+obj.name+"”",
        amount:obj.amount,
        method:obj.trading,
        time:Date(),
        type:false,
        user:user.buy_user
    }
    
    var saleData={
         affair:"卖出“"+obj.name+"”",
         amount:obj.amount,
         method:obj.trading,
         time:Date(),
         type:true,
         user:user.sale_user
    }
    var Data={
        myData:myData,
        saleData:saleData
    }
    var user={
        buy_user:appdata.res_phone,
        sale_user:obj.seller_phone
    }
    return generalBothTrans(Data,user)

}

/**
 * function:买家卖家都生成退货交易记录
 * @obj 物品
 * @user 买家buy_user，卖家sale_user
 */
async function generalReBothTrans(obj,user){
    var myData={
        affair:"“"+obj.name+"”退货收款",
        amount:obj.amount,
        method:obj.trading,
        time:Date(),
        type:true,
        user:user.buy_user
    }
    
    var saleData={
         affair:"“"+obj.name+"”退货付款",
         amount:obj.amount,
         method:obj.trading,
         time:Date(),
         type:false,
         user:user.sale_user
    }
    var Data={
        myData:myData,
        saleData:saleData
    }
    var user={
        buy_user:appdata.res_phone,
        sale_user:obj.seller_phone
    }
    return generalBothTrans(Data,user)
}
/**
 * function: 更新居民馨币
 * @amount 更新后的馨币
 * @user   居民id
 */
async function updateXin(amount,user){
    return await new Promise((resolve,reject)=>{
        wx.cloud.callFunction({
            name:'com',
            data:{
                collection:'resident',
                type:'update',
                myWhere:{
                    phone:user
                },
                myData:{
                    amount:amount
                }
            },
            success(res){
                console.log("馨币更新成功",res)
                resolve(true)
            },
            failed(res){
                console.log("馨币更新失败",res)
                reject(false)
            }
        })
    })
}

/**
 * function:买家卖家都生成取消购买交易记录
 * @obj 物品
 * @user 买家buy_user，卖家sale_user
 */
async function gendeleteTrans(obj,user){
    var str="";
    if(obj.trading=="馨币")str="退款至"+obj.trading
    var myData={
        affair:"您已取消购买"+obj.name+str,
        amount:obj.amount,
        method:obj.trading,
        time:Date(),
        type:true,
        user:appdata.res_phone
        //user.buy_user
    }
    var saleData={
         affair:"买家取消购买"+obj.name,
         amount:obj.amount,
         method:obj.trading,
         time:Date(),
         type:false,
         user:user.sale_user
    }
    var Data={
        myData:myData,
        saleData:saleData
    }
    var user={
        buy_user:appdata.res_phone,
        sale_user:obj.seller_phone
    }
    return generalBothTrans(Data,user)
}

   module.exports = {
    genTrans:generalTrans,
    genBuyBoTrans:generalBuyBothTrans,
    genReBothTrans:generalReBothTrans,
    gendeleteTrans:gendeleteTrans,
    updateXin:updateXin
   }