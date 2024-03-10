const DB=wx.cloud.database().collection("request");
const app=getApp();
let title=''; //请求标题
let user_id=''; //发布人手机号
let time=''; //发布时间
let content=''; //请求内容
let time_limit=''; //时间限制


Page({
  data: {
    title:'',
    user_id:'',
    content:'',
    time_limit:'',
    demand:'',
    level:"初级",
    isUrgent:false,
    type:'家政服务',
    settle_way:'时长',
    amount:0,
    state:'',

    selectDatas: ['家政服务', '教学活动', '协助管理','装配维修','物件取送','信息宣传','其他'], //下拉列表的数据
    shows:false,
    indexs:0
  },

  onLoad: function(options){
    user_id=app.globalData.res_phone; //发布人就是自己
    this.setData({
      user_id:user_id
    })
  },

  updateTitle(event){
    title = event.detail
  },
  updateContent(event){
    content = event.detail
  },
  updateLevel(event){
    level=event.detail
  },
  updateisUrgent(event){
    isUrgent=event.detail
  },
  
  selectTaps() {// 点击下拉显示框
    let that=this
    that.setData({
      shows: !this.data.shows,
    });
  },

  // 点击下拉列表
  optionTaps(e) {
    let index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    type=this.data.selectDatas[index]
    this.setData({
      indexs: index,
      shows: !this.data.shows
    });

  },
  updateTimeLimit(event) {
    time_limit=event.detail
  },
  updateDemand(event) {
    demand=event.detail
  },

  updateType(event){
    type = event.detail
  },
  updateSettle(event){
    settle_way = event.detail
  },
  updateAmount(event){
    amount = event.detail
  },

  //给当前用户添加消息
  add_me_noti(this_content) {
    wx.cloud.callFunction({
      name: 'add_noti',
      data:{
        res_phone:app.globalData.res_phone,
        content:this_content,
        type:'互助'
      },
    })
    .then(res => {
        console.log("当前用户消息", res)
      })
      .catch(console.error)
  },

  // 添加数据
  addData(){
    if(title==''||content=='') {
      wx.showToast({
        title: 'please enter the content',
        icon: 'error'
      })
    } else {
      let that=this
    //弹出提示框
    wx.showModal({
      title: "confirm", // 提示的标题
      content: "confirm to post？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "cancel", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "confirm", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          //添加请求
            wx.cloud.callFunction({
              name: 'add_req',
              data:{
                user_id:user_id,
                title: title,
                content: content,
                time_limit: time_limit,

              },
            })
            .then(res => {
   
                console.log("succussful", res)
                wx.showToast({
                  title: 'success',
                  icon: 'success',
                })
              })
              .catch(console.error)
            wx.hideLoading();

            setTimeout(function () {
              wx.navigateBack()//返回上一页
            },500)
        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
}
  },
})