const DB=wx.cloud.database().collection("announcement");
const app=getApp();
let title='';
let content='';
let magnitude='';
let time=new Date(Date.now());
let Y =time.getFullYear();
//获取月份（需要填充0）
let M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1);
//获取当日日期
let D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate(); 
time=Y+'-'+M+'-'+D;

const stringToDate = function(str) {
  str = str.replace(/-/g, "/");
  return new Date(str);
}

Page({
  
  data: {
    end:Date.now(),
    ann_id:'',
    ann_title:'',
    ann_content:'',
    ann_magnitude:'',
    ann_time:time,
  },

  onLoad: function(options){
  },

  updateTitle(event){
    title = event.detail
  },
  updateContent(event){
    content = event.detail
  },
  updateMagnitude(event){
    magnitude = event.detail
  },

  //添加数据
  addData(){
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认发布公告？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
            // 云函数名称
            name: 'adm_addann',
            // 传给云函数的参数
            data: {
              title:title,
              content:content,
              magnitude:magnitude,
              time:time,
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
})