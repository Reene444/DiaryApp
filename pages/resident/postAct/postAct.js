const DB=wx.cloud.database().collection("activity");
const app=getApp();
let title=''; //活动名
let promoter=''; //发起人编号
let description=''; //活动描述
let start_date=''; //开始日期
let start_time=''; //开始时间
let length=1;//活动时长
let level=''; //规模
let location=''; //活动地点

const stringToDate = function(str1,str2) {
  let str='';
  str=str1+" "+str2;
  str = str.replace(/-/g, "/");
  console.log(str,Date(str))
  return new Date(str);
}

Page({
  data: {
    lim_st_d:'',
    lim_st_t:'',
    title:'',
    promoter:'',
    description:'',
    start_date:'',
    start_time:'',
    length:1,
    level:'',
    limitation:10,
    epi_prevention:'',
    transaction:'',
    amount:0
  },

  setToday(){
    var myDate = new Date();//获取系统当前时间
    var y = myDate.getFullYear(); //年份
    var m = myDate.getMonth()+1; //月份
    var d = myDate.getDate(); //日期
    var H = myDate.getHours();//小时
    var M = myDate.getMinutes();//分
    if(m >=1 && m <=9){
        m = "0" + m;
    }
    if (d >= 1 && d <= 9) {
        d = "0" + d;
    }
    if (H >= 0 && H <= 9) {
        H = "0" + H;
    }
    if (M >= 0 && M <= 9) {
        M = "0" + M;
    }
    
    this.setData({
        start_date: y + "-" + m + "-" + d,
        start_time:H +':'+ M,
        lim_st_d: y + "-" + m + "-" + d,
        lim_st_t:H +':'+ M,
    })
    start_date=this.data.start_date
    start_time=this.data.start_time
  },

  onLoad: function(options){
    this.setToday();
    promoter=app.globalData.res_phone
    console.log(promoter)
    this.setData({
      promoter:promoter
    })
  },

  updateName(event){
    title = event.detail
  },
  updateDescription(event){
    description = event.detail
  },
  updateDate(event) {
    start_date=event.detail.value
    console.log(start_date)
    let that=this
    that.setData({
      start_date: event.detail.value
    })
  },
  updateTime(event) {
    start_time=event.detail.value
    console.log(start_time)
    let that=this
    that.setData({
      start_time: event.detail.value
    })
  },

  updateLevel(event){
    level = event.detail
  },
  updateLocation(event){
    location = event.detail
  },

  updateAmount(event){
    amount = parseInt(event.detail)
  },
  // 添加数据
  addData(){
    console.log(title,description,level,location)
    if(title==''||description==''||level==''||location=='') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'error'
      })
    } else {
    console.log(promoter)
    start_time=stringToDate(start_date,start_time)
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认发布该活动？提交后将等待管理员审核", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
            wx.cloud.callFunction({
              name: 'add_act',
              data:{
                title:title,
                promoter:promoter,
                description:description,
                start_time:start_time,
               
                level:level,
                location:location,
            
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

            // // 添加消息
            // wx.cloud.callFunction({
            //   name: 'add_noti',
            //   data:{
            //     res_phone:promoter,
            //     content:"您的“"+name+"”活动已提交，正在等待管理员审核。",
            //     type:"活动"
            //   },
            // })
            // .then(res => {
            //     console.log("添加成功", res)
            //   })
            //   .catch(console.error)

            wx.hideLoading();
        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
}
  },
})