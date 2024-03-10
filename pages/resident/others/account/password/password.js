// pages/resident/others/account/password/password.js
const app=getApp()
const appdata=app.globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
   oldpassword:"",
   newpassword:"",
   confirmpassword:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      password:options.password
    })
  },
  oldPassword(e){
    this.setData({
      oldpassword:e.detail
    })
  },
  newPassword(e){
    this.setData({
      newpassword:e.detail
    })
  },
  confirmPassword(e){
    this.setData({
      confirmpassword:e.detail
    })
  },
  changePassword(){

    console.log(appdata.res_password)
    if(appdata.res_password!=this.data.oldpassword){
      console.log(appdata.res_password,this.data.oldpassword)
      wx.showToast({
        title: '原密码错误',
        icon:'error'
      })
      return
    }
    if(this.data.newpassword!=this.data.confirmpassword){
      wx.showToast({
        title: '两次秘密输入不一致',
        icon:'error'
      })
      return
    }
    if(this.data.newpassword.length==0) {
      wx.showToast({
        title: '密码不能为空',
        icon:'error'
      })
      return
    }
    let that = this
    console.log(appdata.res_phone)
    wx.cloud.callFunction({
      name:"com",
      data: {
        type:'update',
        collection: 'resident', //修改的集合名称
        myWhere: { //查询的条件
         phone:appdata.res_phone
        },
        myData:{
          //更新的数据
          password:that.data.newpassword
      }
    },
    success(res){
      console.log(res)
      wx.showToast({
        title: '修改成功',
        icon:'success'
      })
      //将新密码记录到全局变量和微信缓存中
  appdata.res_password=that.data.newpassword
  wx.setStorageSync('password', that.data.newpassword)
    },
    failed(res){
      console.log(res)
      wx.showToast({
        title: '修改失败',
        icon:'error'
      })
    }
  })

  }
  

})