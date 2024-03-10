const app=getApp()
const DB=wx.cloud.database().collection("administrator")
let id=''
let password=''
let name=''
let gender=''
let phone=''

Page({
  data:{
    adm_id:'',
    adm_password:'',
    adm_name:'',
    adm_gender:'',
    adm_phone:'',
  },
  //数据初始化
  onLoad: function (options) {

    this.setData({
      adm_id: app.globalData.adm_id,
      adm_password: app.globalData.adm_password,
      adm_name: app.globalData.adm_name,
      adm_phone: app.globalData.adm_phone,
      adm_gender: app.globalData.adm_gender,
    })
    //以防没有更新，那样的话就不会赋值
    id=app.globalData.adm_id
    password=this.data.adm_password;
    name=this.data.adm_name;
    phone=this.data.adm_phone;
    gender=this.data.adm_gender;
  },

  updatePsw(event){
    password = event.detail
  },
  updateName(event){
    name = event.detail
  },
  updateGender(event){
    gender = event.detail
  },
  updatePhone(event){
    phone = event.detail
  },
  //修改数据
  updateData(){
    console.log(id)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_updateInfo',
      // 传给云函数的参数
      data: {
        id:id,
        password:password,
        name:name,
        gender:gender,
        phone:phone
      },
    })
    .then(res => {
      console.log("修改成功", res)
      app.globalData.adm_password=password
      app.globalData.adm_name=name
      app.globalData.adm_gender=gender
      app.globalData.adm_phone=phone

      wx.showToast({
        title: '修改成功',
        icon:'success'
      })
    })
    .catch(console.error)
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