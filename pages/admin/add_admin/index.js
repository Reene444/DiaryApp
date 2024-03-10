// pages/admin/add_admin/index.js
const app=getApp();
let password='';
let name='';
let gender='';
let phone='';
let adm_list=[];

Page({
  data:{
    // adm_account:'',
    adm_password:'',
    adm_name:'',
    adm_gender:'',
    adm_phone:'',
  },

  onLoad: async function(options){
    // account=0 //一定要重置，不然数据会一直累加
    // // 查询最大值
    // wx.cloud.callFunction({
    //   name: 'adm_getlist',
    // })
    // .then(res => {
    //   adm_list=res.result.data
    //   this.setData({
    //     admList:res.result.data
    //   })
    // })
    // .catch(console.error)

    // for(let i=0;i<adm_list.length;i++) {
    //   if(account<adm_list[i].account) {
    //     account=adm_list[i].account
    //   }
    // }
    // account=account+1
    // console.log(""+app.globalData.account_num)
  },

  addPsw(event){
    password = event.detail
  },
  addName(event){
    name = event.detail
  },
  addGender(event){
    gender = event.detail
  },
  addPhone(event){
    phone = event.detail
  },

  //新增数据，account自增只能找最大值，然后手动添加
  async addData(){
    // 添加数据
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_addadm',
      // 传给云函数的参数
      data: {
        // account:account,
        phone:phone,
        password:password,
        name:name,
        gender:gender,
      },
    })
    .then(res => {
      wx.showToast({
        icon:'success',
        title: '添加成功',
      })
      console.log("添加成功",res.result)
    })
    .catch(console.error)
  },
  
  // //获取下一个的值
  // getNumber:async function(){
  //   account=0 //一定要重置，不然数据会一直累加
  //   //查询最大值
  //   wx.cloud.callFunction({
  //     name: 'adm_getlist',
  //   })
  //   .then(res => {
  //     adm_list=res.result.data
  //     this.setData({
  //       admList:res.result.data
  //     })
  //   })
  //   .catch(console.error)

  //   for(let i=0;i<adm_list.length;i++) {
  //     if(account<adm_list[i].account) {
  //       account=adm_list[i].account
  //     }
  //   }
  //   account=account+1
  //   console.log(""+account)
  // }
})