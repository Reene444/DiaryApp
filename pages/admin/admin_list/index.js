const DB=wx.cloud.database().collection("administrator")
const app=getApp()
let totalNum=-1;
Page({
  data:{
    admsList:[]
  },

  onShow: function (options) {
    this.setData({
      admsList:[]
    })
    DB.count().then(res=>{
      totalNum=res.total
    })
    this.getAdmList();
  },

  // 加载管理员数据
  async getAdmList(){
    let len=this.data.admsList.length //现在加载了的数据长度

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
      // 云函数名称
      name: 'adm_getlist_withlimit',
      // 传给云函数的参数
      data: {
        phone: app.globalData.adm_phone,//限制不返回自己的数据
        len:len
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        admsList:this.data.admsList.concat(res.result.data)
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
    // DB.skip(len)
    // .get()
    // .then(res=>{
        
    //   })
    // .catch(res=>{
    //     console.log("获取数据失败", res)
    //     wx.hideLoading()
    //     wx.showToast({
    //       title: '加载失败',
    //     })
    //   })
  },

  // 监听触底事件
  onReachBottom:function(){
    this.getAdmList();
  },

  // 监听下拉事件
  onPullDownRefresh(){
    // 重置数组
    this.setData({
      admsList:[]
    })
    // 发送请求
    this.getAdmList();
  }
})