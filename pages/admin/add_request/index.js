const DB=wx.cloud.database().collection("request");
const app=getApp();
let title=''; //请求标题
let petitioner=''; //发布人手机号
let time=''; //发布时间
let content=''; //请求内容
let time_limit=''; //时间限制
let demand='';//具体要求
let level="初级"; //请求等级
let isUrgent=false;//紧急程度
let type='家政服务'; //请求类型
let settle_way='时长';//结算方式
let amount=0; //基础馨币
let state='';//请求状态

Page({
  data: {
    title:'',
    petitioner:'',
    content:'',
    time_limit:'',
    demand:'',
    level:'初级',
    isUrgent:false,
    type:'家政服务',
    settle_way:'时长',
    amount:0,
    state:'',
  },

  onLoad: function(options){
    petitioner=app.globalData.adm_phone; //发布人就是自己
    this.setData({
      petitioner:petitioner
    })
  },

  updateTitle(event){
    title = event.detail
  },
  updateContent(event){
    content = event.detail
  },
  updateTimeLimit(event) {
    time_limit=event.detail
  },
  updateDemand(event) {
    demand=event.detail
  },
  updateLevel(event){
    level=event.detail
  },
  updateisUrgent(event){
    isUrgent=event.detail
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
  // 添加数据
  addData(){
    if(title==''||content==''||time_limit==''||demand==''
    ||level==''||type==''||settle_way==''||amount=='') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'error'
      })
    } else if(isUrgent==true && level!="高级") {
      wx.showToast({
        title: '只有高级请求能设置紧急',
        icon: 'none'
      })
    } else {
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认发布该请求？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          //添加请求
            wx.cloud.callFunction({
              name: 'add_req',
              data:{
                petitioner:petitioner,
                title: title,
                content: content,
                time_limit: time_limit,
                demand: demand,
                level: level,
                isUrgent: isUrgent,
                type:type,
                settle_way:settle_way,
                amount:amount,
                isOfficial:true, //管理员发布
              },
            })
            .then(res => {
                console.log("添加成功", res)
                wx.showToast({
                  title: '发布成功',
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
}
  },
})