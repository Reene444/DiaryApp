// pages/admin/main/index.js
Page({
  data:{
    //此处为提示数量
    num_urg: '',
    num_apr: '',
    num_app: '',
    num_che: '',
    num_com: '',
  },

  onShow:function(options){
    let that=this
  //紧急请求
      let DB=wx.cloud.database().collection("request")
      DB
      .where({
        isUrgent:true,
        isOfficial:false,
      })
      .count().then(res=>{
        that.setData({
          num_urg:res.total
        })
      })
      // 活动审批
      DB=wx.cloud.database().collection("activity")
      DB
      .where({
        state:"审核中"
      })
      .count().then(res=>{
        that.setData({
          num_apr:res.total
        })
        console.log(res.total)
      })

      //活动签到
      DB=wx.cloud.database().collection("activity")
      DB
      .where({
        state:"活动中"
      })
      .count().then(res=>{
        that.setData({
          num_che:res.total
        })
        console.log(res.total)
      })

      //申诉
      DB=wx.cloud.database().collection("appeal")
      DB.count().then(res=>{
        that.setData({
          num_app:res.total
        })
      })

      //居民意见
      DB=wx.cloud.database().collection("communication")
      DB
      .where({
        ischecked:false
      })
      .count().then(res=>{
        that.setData({
          num_com:res.total
        })
      })
  }
  
})