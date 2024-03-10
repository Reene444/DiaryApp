const DB=wx.cloud.database().collection("administrator");
const app=getApp();
let id='';
let password='';
let name='';
let gender='';
let phone='';

Page({
  
  data:{
    adm_id:'',
    adm_password:'',
    adm_name:'',
    adm_gender:'',
    adm_phone:''
  },

  onLoad: function(options){
    const {adm_id}=options;
    this.getAdminInfo(adm_id)
    id=adm_id;
  },

  // 获取管理员信息
  async getAdminInfo(this_id){
    let that=this;
    DB.where({
      _id:this_id
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      password=res.data[0].password,
      name=res.data[0].name,
      phone=res.data[0].phone
      gender=res.data[0].gender,

      that.setData({
        adm_id:res.data[0]._id,
        adm_password:res.data[0].password,
        adm_name:res.data[0].name,
        adm_gender:res.data[0].gender,
        adm_phone:res.data[0].phone
      })
    })
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
        wx.showToast({
          title: '修改成功',
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
      content: "确认删除管理员信息？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
            wx.cloud.callFunction({
              name: 'adm_deleteadm',
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