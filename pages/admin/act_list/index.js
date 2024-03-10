const DB=wx.cloud.database().collection("activity")
const app=getApp()
let totalNum=-1;

Page({
  data:{
    actList:[] //活动列表
  },

  onShow: function (options) {
    this.setData({
      actList:[]
    })
    DB.count().then(res=>{
      totalNum=res.total
    })
    this.getActList();
  },

  // 加载活动数据
  async getActList(){
    let len=this.data.actList.length

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
      name: 'adm_getActlist_withlimit',
      data: {
        len:len
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        actList:this.data.actList.concat(res.result.data)
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
    this.getActList();
  },

    // 监听下拉事件
    onPullDownRefresh(){
      // 重置数组
      this.setData({
        actList:[]
      })
      // 发送请求
      this.getActList();
    }
})