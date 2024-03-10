// pages/admin/login/index.js
let id=''
let phone=''
let password=''
const app=getApp()
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    value: '', //value存储输入的值
  },
  
  getPhone(event) {
    phone=event.detail
  },

  getPassword(event) {
    password=event.detail;
  },

  onclick(){
    this.check();
  },

  onLoad(){
    phone=wx.getStorageSync("usercode"),
    password=wx.getStorageSync("password");
    console.log(phone,password)
    if((phone.length!=0)&&(password.length!=0)) {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_login',
      // 传给云函数的参数
      data: {
        phone:phone,
        password:password,
      },
    })
    .then(res => {
      if(res.result.data.length!=0){
        wx.showToast({
          title: '自动登录中',
          icon:'loading'
        })
        //存储用户信息
        app.globalData.adm_id=res.result.data[0]._id,
        app.globalData.adm_password=res.result.data[0].password,
        app.globalData.adm_name=res.result.data[0].name,
        app.globalData.adm_gender=res.result.data[0].gender,
        app.globalData.adm_phone=res.result.data[0].phone;

        if(res.result.data[0]._id=="5b049cc86211b62b0d581e265823e5ca") { //判断是否是总管
          app.globalData.isManager=true;
          app.globalData.warmth_amount=res.result.data[0].warmth_amount;
        } else {
          app.globalData.isManager=false;
        }

        console.log("查询成功",res)
        // Toast.success("你好，"+app.globalData.adm_name)
        if(app.globalData.adm_phone.length!=0) {
          wx.reLaunch({
            url: '../guide/index',
          })
        }
      }
    })
    .catch(console.error)
  }
  },

  //查询账号，密码是否匹配
  check() {
    if(phone.length==0 || password.length==0){
      Toast.fail("输入不能为空")
    } else {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_login',
      // 传给云函数的参数
      data: {
        phone:phone,
        // account:parseInt(account),
        password:password,
      },
    })
    .then(res => {
      let that=this;
      that.LoginForm();
      if(res.result.data.length!=0){
        //存储用户信息
        app.globalData.adm_id=res.result.data[0]._id,
        app.globalData.adm_password=res.result.data[0].password,
        app.globalData.adm_name=res.result.data[0].name,
        app.globalData.adm_gender=res.result.data[0].gender,
        app.globalData.adm_phone=res.result.data[0].phone;

        if(res.result.data[0]._id=='5b049cc86211b62b0d581e265823e5ca') { //判断是否是总管
          app.globalData.isManager=true;
          app.globalData.warmth_amount=res.result.data[0].warmth_amount;
        } else {
          app.globalData.isManager=false;
        }

        console.log("查询成功",res)
        // Toast.success("你好，"+app.globalData.adm_name)
        if(app.globalData.adm_phone.length!=0) {
          wx.reLaunch({
            url: '../guide/index',
          })
        }
      } else {
        Toast.fail("账号不存在或密码错误，\n请重新输入")
      }
    })
    .catch(console.error)
  }
  },

  //登录缓存密码
  LoginForm: function (e) { //登录加载效果

    // var checkedValue = that.data.switchChecked;
    // console.log(checkedValue);
    // //如果记住密码则向微信缓存写入账号密码
    // //如果不记住密码则清空微信缓存存在的账号密码
    // if (checkedValue == true) {
      wx.setStorageSync("usercode",phone);
      wx.setStorageSync("password",password);
      wx.setStorageSync('isadmin', 1);
      console.log(phone,password);
    // } else if (checkedValue == false) {
    //   wx.setStorageSync("strloginUser","");
    //   wx.setStorageSync("strloginpassword","");
    // }
  
  },
})