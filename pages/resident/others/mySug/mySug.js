var objBuyHelp=require("../../../../utils/ObjBuyHelp.js")
const DB=wx.cloud.database().collection("communication");
const app=getApp();
const appdata=app.globalData
let id='';
let content='';

Page({
  data: {
  },

  onLoad: function(options){
  },

  updateSug(event){
    content=event.detail
  },

  //添加意见
  updateData(){
    let that=this
    wx.cloud.callFunction({
      name:'com',
      data:{
          type:'add',
          collection:'communication',
          myData:{
              obj_id:that.data.obj_id,
              resident:appdata.res_phone,
              ischecked:false,
              content:content,
              type:'建议'
          },
      },
      success(res){
        if(res.result)
        {
            console.log("添加成功",res)
            wx.showToast({
              icon:'success',
              title: '上传成功',
            })

            //给发出意见的居民添加消息
            var noi="您的建议已成功上传，请等待管理员回复"
            //添加消息
            wx.cloud.callFunction({
              name: 'add_noti',
              data:{
                res_phone:appdata.res_phone,
                content:noi,
                type:"其他"
              },
            })
        }
        else{
            console.log("添加失败",res)
        }
      },
  })

  setTimeout( function(){
    wx.navigateBack(); //返回上一页
  },500)

  },


})