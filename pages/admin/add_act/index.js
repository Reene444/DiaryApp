const DB=wx.cloud.database().collection("activity");
const app=getApp();
let name=''; //活动名
let promoter=''; //发起人编号
let description=''; //活动描述
let start_date=''; //开始日期
let start_time=''; //开始时间
let location=''; //活动地点
let length=1;//活动时长
let scale=''; //规模
let limitation=10; //人数限制
let epi_prevention=''; //防疫要求
let transaction=''; //交易方式
let amount=0; //金额

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
    name:'',
    promoter:'',
    description:'',
    start_date:'',
    start_time:'',
    location:'',
    length:1,
    scale:'',
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
    promoter=app.globalData.adm_phone
    this.setData({
      promoter:promoter
    })
  },

  updateName(event){
    name = event.detail
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
  updateLength(event) {
    length=event.detail
  },
  updateLocation(event){
    location=event.detail
  },
  updateScale(event){
    scale = event.detail
  },
  updateLimitation(event){
    limitation = event.detail
  },
  updateEpi_prevention(event){
    epi_prevention = event.detail
  },
  updateTransaction(event){
    transaction = event.detail
  },
  updateAmount(event){
    amount = event.detail
  },
  // 添加数据
  addData(){
    if(name==''||description==''||scale==''||location==''
    ||limitation==''||epi_prevention==''||amount=='') {
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
      content: "确认发布该活动？", // 提示的内容
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
                name:name,
                promoter:promoter,
                description:description,
                start_time:start_time,
                length:length,
                location:location,
                scale:scale,
                limitation:limitation,
                state:'报名中',//状态：管理员提交直接变为报名中
                epi_prevention:epi_prevention,
                transaction:transaction,
                amount:amount,
                isOfficial:true
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