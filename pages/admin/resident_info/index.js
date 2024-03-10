const DB=wx.cloud.database().collection("resident");
const app=getApp();
let id='';
let phone='';
let password='';
let name='';
let gender='';
let birthday='1900-01-01';
let credit_score=100;
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
    res_id:'',
    res_phone:'',
    res_password:'',
    res_name:'',
    res_gender:'',
    res_time:'',
    res_birthday:'1900-01-01',
    res_credit_score:0,
    res_amount:0,
    res_primary_card:0,
    res_middle_card:0,
    res_advanced_card:0,
  },

  onLoad: function(options){
    const {res_id}=options;
    this.getResInfo(res_id);
    id=res_id;
  },

  // 获取居民信息
  async getResInfo(this_id){
    let that=this;
    DB.where({
      _id:this_id
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      phone=res.data[0].phone,
      password=res.data[0].password,
      name=res.data[0].name,
      gender=res.data[0].gender,
      birthday=res.data[0].birthday;
      var Y =birthday.getFullYear();
      //获取月份（需要填充0）
      var M = (birthday.getMonth() + 1 < 10 ? '0' + (birthday.getMonth() + 1) : birthday.getMonth() + 1);
      //获取当日日期
      var D = birthday.getDate() < 10 ? '0' + birthday.getDate() : birthday.getDate(); 
      birthday=Y+'-'+M+'-'+D;
      credit_score=res.data[0].credit_score;
      amount=res.data[0].amount,
      primary_card=res.data[0].primary_card,
      middle_card=res.data[0].middle_card,
      advanced_card=res.data[0].advanced_card,

      that.setData({
        res_id:res.data[0]._id,
        res_phone:res.data[0].phone,
        res_password:res.data[0].password,
        res_name:res.data[0].name,
        res_gender:res.data[0].gender,
        res_birthday:birthday,
        res_credit_score:res.data[0].credit_score,
        res_amount:res.data[0].amount,
        res_primary_card:res.data[0].primary_card,
        res_middle_card:res.data[0].middle_card,
        res_advanced_card:res.data[0].advanced_card
      })
    })
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
    console.log('picker发送选择改变，携带值为', event.detail.value)
    birthday=stringToDate(event.detail.value)
    console.log(birthday)
    let that=this
    that.setData({
      res_birthday: event.detail.value
    })
  },
  updateCredit(event){
    credit_score = event.detail
  },
  updateAmount(event){
    amount = parseFloat(event.detail)
  },
  updatePrimary(event){
    primary_card = parseInt(event.detail)
  },
  updateMiddle(event){
    middle_card = parseInt(event.detail)
  },
  updateAdvanced(event){
    advanced_card = parseInt(event.detail)
  },

  //修改数据
  updateData(){
    console.log(amount)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_updateResInfo',
      // 传给云函数的参数
      data: {
        id:id,
        phone:phone,
        password:password,
        name:name,
        gender:gender,
        birthday:birthday,
        credit_score:credit_score,
        amount:parseFloat(amount),
        primary_card:primary_card,
        middle_card:middle_card,
        advanced_card:advanced_card
      },
    })
    .then(res => {
        console.log("修改成功", res)
        wx.showToast({
          title: '修改成功',
          icon: 'success',
        })
      })
      .catch(console.error)
  },

  deleteRes:function(){
    wx.cloud.callFunction({
      name: 'adm_deleteres',
      data:{
        id:id
      },
    })
    .then(res => {
        console.log("删除成功", res)
        wx.showToast({
          title: '删除成功',
          icon: 'success',
        })
      })
      .catch(console.error)
  },
  
  // 删除数据
  deleteData(){
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认删除居民信息？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
            wx.cloud.callFunction({
              name: 'adm_deleteres',
              data:{
                id:id
              },
            })
            .then(res => {
                console.log("删除成功", res)
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                })
              })
              .catch(console.error)
            wx.hideLoading();
        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
  },
})