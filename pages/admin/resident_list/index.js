const DB=wx.cloud.database().collection("resident")
const app=getApp()
let totalNum=-1;

Page({
  data:{
    resList:[] //居民列表
  },

  onShow: function (options) {
    this.setData({
      resList:[]
    })
    DB.count().then(res=>{
      totalNum=res.total
    })
    this.getResList();
  },

  // 加载居民数据
  async getResList(){
    let len=this.data.resList.length //现在加载了的数据长度

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
      name: 'adm_getReslist_withlimit',
      data: {
        len:len
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        resList:this.data.resList.concat(res.result.data)
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
    this.getResList();
  },

    // 监听下拉事件
    onPullDownRefresh(){
      // 重置数组
      this.setData({
        resList:[]
      })
      // 发送请求
      this.getResList();
    }
})