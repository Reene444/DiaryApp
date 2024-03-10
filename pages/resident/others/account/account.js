// pages/resident/others/account/account.js
const appdata=getApp().globalData
Page({
  data: {
   phone:""
  },

  onLoad: function (options) {
    var tphone=String(appdata.res_phone)
      this.setData({
        phone:tphone.replace(tphone.substring(2,10),'*******')
      })
      console.log(String(appdata.res_phone))
  },

  logout(){
    wx.showModal({
      title: '退出登录',
      content: '确定退出该账号？',
      cancelText:'取消',
      confirmText:'确定',
      confirmColor:'#FFC65B',
      cancelColor:'#000000',

      success (res) {
        if (res.confirm) {
          //清除已有的res
          wx.clearStorage({
            success: (res) => {
              console.log("清除数据成功")
            },
          })
          wx.reLaunch({
            url: '/pages/main/main',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }
})