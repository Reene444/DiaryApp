let phone=''
let password=''
const app=getApp()
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'
const DB=wx.cloud.database().collection("resident");
// let  WebIM=require('../../../utils/WebIM')["default"];

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
    password=wx.getStorageSync("password"),

    // DB
    // .where({
    //   phone:phone,
    //   password:password
    // })

    wx.cloud.callFunction({
      // 云函数名称
      name: 'res_login',
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
        console.log("registrer",phone)
        // this.test(phone);
        //存储用户信息
        app.globalData.res_phone=res.result.data[0].phone,
        app.globalData.res_password=res.result.data[0].password,
        app.globalData.res_name=res.result.data[0].name,
        app.globalData.res_gender=res.result.data[0].gender,
        app.globalData.res_birthday=res.result.data[0].birthday,
        app.globalData.res_credit_score=res.result.data[0].credit_score,
        app.globalData.res_amount=res.result.data[0].amount,
        app.globalData.res_primary_card=res.result.data[0].primary_card,
        app.globalData.res_middle_card=res.result.data[0].middle_card,
        app.globalData.res_advanced_card=res.result.data[0].advanced_card

        if(app.globalData.res_phone.length!=0) {
          wx.reLaunch({
            url: '../market/market',
          })
        }
        console.log("查询成功",res)
      }
    })
    
  },

  //查询账号，密码是否匹配
  check() {
    if(phone.length==0 || password.length==0){
      Toast.fail("输入不能为空")
    } else {
    wx.cloud.callFunction({
      // 云函数名称
      name: 'res_login',
      // 传给云函数的参数
      data: {
        phone:phone,
        password:password,
      },
    })
    .then(res => {
      let that=this;
      that.LoginForm();
      if(res.result.data.length!=0){
        wx.showToast({
          title: '登录中',
          icon:'loading'
        })
        //存储用户信息
        app.globalData.res_phone=res.result.data[0].phone,
        app.globalData.res_password=res.result.data[0].password,
        app.globalData.res_name=res.result.data[0].name,
        app.globalData.res_gender=res.result.data[0].gender,
        app.globalData.res_birthday=res.result.data[0].birthday,
        app.globalData.res_credit_score=res.result.data[0].credit_score,
        app.globalData.res_amount=res.result.data[0].amount,
        app.globalData.res_primary_card=res.result.data[0].primary_card,
        app.globalData.res_middle_card=res.result.data[0].middle_card,
        app.globalData.res_advanced_card=res.result.data[0].advanced_card

        if(app.globalData.res_phone.length!=0) {
          wx.reLaunch({
            url: '../market/market',
          })
        }
        console.log("查询成功",res)
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

      console.log(phone,password);
      // var options = { 
      //   user:phone,
      //   appKey: WebIM.config.appkey
      // };
      // conn.open(options);
      // conn.close();
    
    // } else if (checkedValue == false) {
    //   wx.setStorageSync("strloginUser","");
    //   wx.setStorageSync("strloginpassword","");
    // }
  // this.test(phone);
  // this.getopenid();
  },
  test(e){
    let that = this;
    var options = {
      apiUrl: WebIM.config.apiURL,
      username: e,
      password: e,
      nickname: "",
      appKey: WebIM.config.appkey,
      success: function(res){
        console.log('注册成功', res)	
        that.toastSuccess('注册成功');
        var data = {
          apiUrl: WebIM.config.apiURL,
          user: that.data.username.toLowerCase(),
          pwd: that.data.password,
          grant_type: "password",
          appKey: WebIM.config.appkey
        };
        wx.setStorage({
          key: "myUsername",
          data: that.data.username
        });
        wx.redirectTo({
          url: "../login/login?username="+that.data.username+"&password="+that.data.password
        });
      },
      error: function(res){
        console.log('注册失败', res)
        if (res.statusCode == '400' && res.data.error == 'illegal_argument') {
          if (res.data.error_description === 'USERNAME_TOO_LONG') {
                         return that.toastFilled('用户名超过64个字节！')
                      }
          return that.toastFilled('用户名非法!')
        }else if (res.data.error === 'duplicate_unique_property_exists') {
                      // return that.toastFilled('用户名已被占用!')
                      console.log(1)
                  }else if (res.data.error === 'unauthorized') {
                      // return that.toastFilled('注册失败，无权限！')
                      console.log(2)
                  } else if (res.data.error === 'resource_limited') {
                      // return that.toastFilled('您的App用户注册数量已达上限,请升级至企业版！')
                      console.log(3)
                  }else{
                    // return that.toastFilled('注册失败')
                    console.log(4)
                  }
        
      }
    };
    console.log("registrer",e)
    WebIM.conn.registerUser(options);

  },
  getopenid(){
    wx.cloud.callFunction({
      name:"getopenid"
    }).then(res=>{
      console.log("获取成功")
      
    }).catch(res=>{
      console.log('获取openid失败',res)
    })
  }
})
