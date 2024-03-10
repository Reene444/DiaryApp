// pages/admin/guide/index.js
Page({

  to_main(){
    wx.navigateTo({
    url: '../main/index',
    success: (result) => {},
    fail: (res) => {},
    complete: (res) => {},
  })
  },

  to_manager(){
    wx.navigateTo({
      url: '../management/index',
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
  })
}

})