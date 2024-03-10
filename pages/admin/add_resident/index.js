const DB=wx.cloud.database().collection("resident");
const app=getApp();
let phone='';
let password='';
let name='';
let gender='';
let birthday='1900-01-01';
let amount=0;
let primary_card=0;
let middle_card=0;
let advanced_card=0;
const stringToDate = function(str) {
  str = str.replace(/-/g, "/");
  console.log(str)
  return new Date(str);
}

Page({
  
  data: {
    end:Date.now(),
    res_phone:'',
    res_password:'',
    res_name:'',
    res_gender:'',
    res_time:'',
    res_birthday:'1900-01-01',
    res_amount:0,
    res_primary_card:0,
    res_middle_card:0,
    res_advanced_card:0,
  },

  onLoad: function(options){
  },

  updatePhone(event){
    phone = event.detail
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
  updateBirthday(event) {
    birthday=stringToDate(event.detail.value)
    console.log(birthday)
    let that=this
    that.setData({
      res_birthday: event.detail.value
    })
  },
  updateAmount(event){
    amount = event.detail
  },
  updatePrimary(event){
    primary_card = event.detail
  },
  updateMiddle(event){
    middle_card = event.detail
  },
  updateAdvanced(event){
    advanced_card = event.detail
  },

  //添加数据
  updateData(){
    console.log(phone)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_addres',
      // 传给云函数的参数
      data: {
        phone:phone,
        password:password,
        name:name,
        gender:gender,
        birthday:birthday,
        amount:amount,
        primary_card:primary_card,
        middle_card:middle_card,
        advanced_card:advanced_card
      },
    })
    .then(res => {
        console.log("添加成功", res)
        wx.showToast({
          title: '添加成功',
          icon: 'success',
        })
      })
      .catch(console.error)
      wx.navigateBack(); //返回上一页
  },
})