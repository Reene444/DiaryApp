// pages/resident/others/myinfro/myinfro.js
const app=getApp()
const appdata=getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userinfro:{
        name:"",
        gender:"",
        birthday:"",
        phone:"",
        password:"",
        cards:{},
        amount:"",
        credit_score:0
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      var tphone=String(appdata.res_phone)
      var bir=String(appdata.res_birthday)
       this.setData({
        userinfro:{
          name:appdata.res_name,
          gender:appdata.res_gender,
          amount:appdata.res_amount,
          birthday:bir.substring(0,10),
          phone:tphone.replace(tphone.substring(2,10),'*******'),
          password:appdata.res_password,
          cards:{
            advanced_card:appdata.res_advanced_card,
            primary_card:appdata.res_primary_card,
            middle_card:appdata.res_middle_card,
            num:this.cardnum()
          },
          credit_score:appdata.res_credit_score
        }
       })
       console.log(this.data.userinfro)
  },
  cardnum(){
    return appdata.res_advanced_card +appdata.res_middle_card + appdata.res_primary_card
  },
/**
 *   res_phone: null,
    res_password: null,
    res_name: null,
    res_gender: null,
    res_birthday: null,
    res_credit_score: 0,
    res_amount: 0,
    res_primary_card: 0,
    res_middle_card: 0,
    res_advanced_card: 0,
 */
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})