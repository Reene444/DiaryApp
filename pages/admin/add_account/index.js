const app=getApp();
let book_event=0
let book_amount=0
let origin_amount=0 //记录原始资金

Page({
  data: {
    book_event:0,
    book_amount:0,
    origin_amount:0
  },

  onLoad: function(options){
    origin_amount=app.globalData.warmth_amount
    this.setData({
      origin_amount:app.globalData.warmth_amount
    })
  },

  addEvent(event){
    book_event = event.detail
  },
  addAmount(event){
    book_amount = parseInt(event.detail)
  },
  // 添加数据
  addData(){
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "金额与事件描述提交后无法修改，是否确认提交？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          //先添加记录进账本
          wx.cloud.callFunction({
            name: 'adm_addbook',
            data:{
              book_event:book_event,
              book_amount:book_amount,
            },
          })
          .then(res => {
              console.log("添加成功", res)
            })
            .catch(console.error)
        book_amount=parseInt(book_amount)+origin_amount
        //再修改基础设置中的总账
        wx.cloud.callFunction({
          name: 'adm_update_amount',
          data:{
            amount:book_amount
          },
        })
        .then(res => {
            //修改缓存
            app.globalData.warmth_amount=book_amount
            that.setData({
              origin_amount:app.globalData.warmth_amount
            })
            origin_amount=app.globalData.warmth_amount
            console.log(app.globalData.warmth_amount)
            console.log("更新成功", res)
            wx.showToast({
              title: '存入成功',
              icon: 'success',
            })
          })
          .catch(console.error)

          wx.hideLoading();

          setTimeout(function(){
            wx.navigateBack(); //返回上一页
          },500)
          
        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
  },
})