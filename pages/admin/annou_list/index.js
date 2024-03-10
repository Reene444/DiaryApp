const DB=wx.cloud.database().collection("announcement")
const app=getApp()
let totalNum=-1;

Page({
  data:{
    annList:[] //公告列表
  },

  onShow: function (options) {
    this.setData({
      annList:[]
    })
    DB.count().then(res=>{
      totalNum=res.total
    })
    this.getAnnList();
  },

  // 加载公告数据
  async getAnnList(){
    let len=this.data.annList.length //现在加载了的数据长度

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
      name: 'adm_getAnnlist_withlimit',
      data: {
        len:len
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        annList:this.data.annList.concat(res.result.data)
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
    this.getAnnList();
  },

    // 监听下拉事件
    onPullDownRefresh(){
      // 重置数组
      this.setData({
        annList:[]
      })
      // 发送请求
      this.getAnnList();
    }
})