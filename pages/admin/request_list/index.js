const DB=wx.cloud.database().collection("request")
const app=getApp()
let totalNum=-1;

Page({
  data:{
    reqList:[] //请求列表
  },

  onShow: function (options) {
    this.setData({
      reqList:[]
    })
    DB.count().then(res=>{
      totalNum=res.total
    })
    this.getReqList();
  },

  // 加载请求数据
  async getReqList(){
    let len=this.data.reqList.length

    if(totalNum==len) {
      wx.showToast({
        title: '数据已加载完',
      })
      return
    }
    wx.showLoading({
      title:'加载中'
    })
  
    wx.cloud.callFunction({
      name: 'adm_getReqlist_withlimit',
      data: {
        len:len
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        reqList:this.data.reqList.concat(res.result.data)
      })

      wx.hideLoading()
    })
    .catch(res=>{
      console.log("获取数据失败", res)
      wx.hideLoading()
      wx.showToast({
        icon:'error',
        title: '加载失败',
      })
    })
  },

  // 监听触底事件
  onReachBottom:function(){
    this.getReqList();
  },

    // 监听下拉事件
    onPullDownRefresh(){
      // 重置数组
      this.setData({
        reqList:[]
      })
      // 发送请求
      this.getReqList();
    }
})