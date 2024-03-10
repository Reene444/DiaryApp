var objBuyHelp=require("../../../utils/ObjBuyHelp.js")
const DB=wx.cloud.database().collection("communication");
const app=getApp();
let id='';
let reply='';

Page({
  
  data: {
    com:{},
    obj:{}
  },

  onLoad: function(options){
    const {com_id}=options;
    id=com_id;
    this.getComInfo(com_id);
  },

  // 获取信息
  async getComInfo(this_id){
    let that=this;
    DB.where({
      _id:this_id
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      // content=res.data[0].content,
      // ischecked=res.data[0].ischecked,
      // reply=res.data[0].reply,
      // resident=res.data[0].resident;
      that.setData({
        com:res.data[0]
      })

      if(that.data.com.type=='集市') {//获取物品信息
        
        objBuyHelp.getObjDetail(that.data.com.content).then((res)=>{
          console.log("物品detail:",res)
          this.setData({
              obj:res
          })
          console.log(this.data.obj)
      })
      }
    })
  },

  updateReply(event){
    reply=event.detail
  },

  //设置已阅览
  updateData(){
    let that=this
    console.log(reply)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_updateComInfo',
      // 传给云函数的参数
      data: {
        id:id,
        reply:reply
      },
    })
    .then(res => {
        console.log("修改成功", res)
        wx.showToast({
          icon:'success',
          title: '确认成功',
        })

        //给发出意见的居民添加消息
        var noi="对于您在"+that.data.com.type+"方面提出的问题，管理员回复如下："+reply
        //添加消息
        wx.cloud.callFunction({
          name: 'add_noti',
          data:{
            res_phone:that.data.com.resident,
            content:noi,
            type:that.data.com.type
          },
        })
        .then(res => {
            console.log("添加成功", res)
          })
        .catch(console.error)
      })
      .catch(console.error)
      wx.navigateBack(); //返回上一页
  },


})