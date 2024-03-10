const DB=wx.cloud.database().collection("account_book")
const app=getApp()
let totalNum=-1;

Page({
  data:{
    accountList:[] //账目列表
  },

  onLoad: function (options) {
    DB.count().then(res=>{
      totalNum=res.total
    })
    this.getAccountList();
  },

  // 加载账目数据
  async getAccountList(){
    let len=this.data.accountList.length //现在加载了的数据长度

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
      name: 'adm_getAccountlist_withlimit',
      data: {
        len:len
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        accountList:this.data.accountList.concat(res.result.data)
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
    this.getAccountList();
  },

    // 监听下拉事件
    onPullDownRefresh(){
      // 重置数组
      this.setData({
        accountList:[]
      })
      // 发送请求
      this.getAccountList();
    }
})