const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data:{
    Login:0,//是否第一次登录
    relogin:0,//是否为切换账号
    isadmin:0
  },

onLoad(data){
 
},


  reslogin(){
    wx.navigateTo({
      url: '../resident/login/login',
    })
  },
})