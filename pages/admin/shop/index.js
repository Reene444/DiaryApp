const DB=wx.cloud.database().collection("setting");
const app=getApp();
let primary=1;
let middle=1;
let advanced=1;

Page({
  
  data: {
    primary_card:1,
    middle_card:1,
    advanced_card:1
  },

  onLoad: function(options){
    this.getShopInfo();
  },

  // 获取信息
  async getShopInfo(){
    let that=this;
    DB.where({
      id:0
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      primary=res.data[0].primary_card,
      middle=res.data[0].middle_card,
      advanced=res.data[0].advanced_card;
      that.setData({
        primary_card:res.data[0].primary_card,
        middle_card:res.data[0].middle_card,
        advanced_card:res.data[0].advanced_card
      })
    })
  },

  updateP(event){
    primary=event.detail
  },
  updateM(event){
    middle=event.detail
  },
  updateA(event){
    advanced=event.detail
  },
  updateData(){
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认修改兑换设置信息？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            // 云函数名称
            name: 'adm_updateset_card',
            // 传给云函数的参数
            data: {
              primary:primary,
              middle:middle,
              advanced:advanced
            },
          })
          .then(res => {
              console.log("修改成功", res)
              wx.showToast({
                icon:'success',
                title: '修改成功',
              })
            })
            .catch(console.error)
            wx.hideLoading();
            wx.navigateBack(); //返回上一页
        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
    })
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
                phone:phone
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
            wx.navigateBack(); //返回上一页
        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
  },
})