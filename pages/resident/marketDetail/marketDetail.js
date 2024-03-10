const app=getApp()
const appdata=app.globalData
var genTrans=require("../../../utils/ObjTransactionHelp.js")
var objBuyHelp=require("../../../utils/ObjBuyHelp.js")
var showHelp=require("../../../utils/showHelp.js")

let msg={title:"购买失败",icon:"error"}
Page({
    data: {
        obj_id:"",
        buyer_phone:"",
        obj:{
            name:"",
            description:"",
            seller_phone:"",
            amount:0,
            time:"",
            location:"",
            state:"",
            type:"",
            trading:"",
            picture:{},
        },

        identity:0, //用户身份：0表示都不是，1表示是上传者，2表示是购买者
        //设置步骤条
        steps: [
            {
              text: '物品上传',
            },
            {
              text: '有人购买',
            },
            {
              text: '确认发货',
            },
            {
              text: '确认收货'
            },
          ],
          active: 0,
    },

    onLoad: function (options) {
      let myWhere={
         _id:options.id
      }
        console.log('onload')
        this.setData({
            _id:options.id
        })
        console.log(options.id)
    
        //获取物品信息
        wx.cloud.callFunction({
         name: 'com',
         data:{
            type:'get',
            collection:'diary',
            myWhere:myWhere
         }
       })
       .then(res => {
         console.log("获取数据成功", res)
         this.setData({
           obj:res.result.data[0]
         })
       })
       .catch(res=>{
         console.log("获取数据失败", res)
       })


        
    },


    /*
    //等待购买中：物品发布者，“等待购买”，不可点击
            //其他，“购买”，支付金额
                
    //发货中：发布者，“确认发货”，将物品放在指定地点，并设置领取消息
            //购买者，“待发货”，不可点击
                //“取消购买”，退还金额

            //其他，“已有人购买”，不可点击
    //收货中：发布者，“待收货”，不可点击
            //购买者，“确认收货”，领取物品
                //“未收到货？”，弹出框：自行联系或管理员联系，与“长时间未发货”一样，只是处理事务里写的不一样
                //本质上只是添加一条消息让管理员去提醒，管理员点击“确认处理完成”，处理就只有联系然后按正常流程走
                //，或者下架物品
            //其他，“已有人购买”，不可点击
    //交易达成：所有人，“交易达成”，不可点击*/

})