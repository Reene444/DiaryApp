const app=getApp()

Page({
  data:{
    showView: false,
    adm_name:'',
    adm_account:''
  },
  // 初始化管理员信息
  onShow: function (options) {
    let that = this
    that.setData({
      showView:app.globalData.isManager
    })
console.log(app.globalData.adm_phone)
    that.setData({
      adm_name: app.globalData.adm_name,
      adm_phone: app.globalData.adm_phone
    })
  },
  info_mod() {
    wx.navigateTo({
      url: '../info_mod/index',
    })
  },
  admin_list() {
    wx.navigateTo({
      url: '../admin_list/index',
    })
  },
  add_admin() {
    wx.navigateTo({
      url: '../add_admin/index',
    })
  },
  account_book() {
    wx.navigateTo({
      url: '../account_book/index',
    })
  },
  add_account() {
    wx.navigateTo({
      url: '../add_account/index',
    })
  },
  trading_record() {
    wx.navigateTo({
      url: '../trading_record/index',
    })
  },
  shop() {
    wx.navigateTo({
      url: '../shop/index',
    })
  },
  request_list() {
    wx.navigateTo({
      url: '../request_list/index',
    })
  },
  add_request() {
    wx.navigateTo({
      url: '../add_request/index',
    })
  },
  act_list() {
    wx.navigateTo({
      url: '../act_list/index',
    })
  },
  add_act() {
    wx.navigateTo({
      url: '../add_act/index',
    })
  },
  annou_list() {
    wx.navigateTo({
      url: '../annou_list/index',
    })
  },
  add_annou() {
    wx.navigateTo({
      url: '../add_annou/index',
    })
  },
  object_list() {
    wx.navigateTo({
      url: '../object_list/index',
    })
  },
  resident_list() {
    wx.navigateTo({
      url: '../resident_list/index',
    })
  },
  add_res(){
    wx.navigateTo({
      url: '../add_resident/index',
    })
  }
})