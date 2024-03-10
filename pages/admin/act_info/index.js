const DB=wx.cloud.database().collection("activity");
const app=getApp();
let id=''; //编号
let name=''; //活动名
let promoter=''; //发起人
let description=''; //活动描述
let start_date='1900-01-01'; //开始日期
let start_time='00:00'; //开始时间
let length=0;//活动时长
let location='';//活动地点
let scale=''; //规模
let limitation=0; //人数限制
let state=''; //状态
let epi_prevention=''; //防疫要求
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
    lim_ed_d:'',
    lim_ed_t:'',
    id:'',
    name:'',
    promoter:'',
    description:'',
    start_date:'1900-01-01',
    start_time:'00:00',
    length:1,
    location:'',
    scale:'',
    limitation:0,
    state:'',
    epi_prevention:'',
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
    if (H >= 1 && H <= 9) {
        H = "0" + H;
    }
    if (M >= 1 && M <= 9) {
        M = "0" + M;
    }
    
    this.setData({
        start_date: y + "-" + m + "-" + d,
        start_time:H +':'+ M,
        // lim_st_d: y + "-" + m + "-" + d,
        // lim_st_t:H +':'+ M,
    })
    start_date=this.data.start_date
    start_time=this.data.start_time
  },

  onLoad: function(options){
    const {act_id}=options;
    this.getActInfo(act_id);
    id=act_id;
  },

  // 获取活动信息
  async getActInfo(this_id){
    let that=this;
    DB.where({
      _id:this_id
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      name=res.data[0].name,
      promoter=res.data[0].promoter,
      description=res.data[0].description;
      start_time=res.data[0].start_time
      // 先将原本数据库中的属性start_time拆成前后两部分date和time
      var Y =start_time.getFullYear();
      var M = (start_time.getMonth() + 1 < 10 ? '0' + (start_time.getMonth() + 1) : start_time.getMonth() + 1);
      var D = start_time.getDate() < 10 ? '0' + start_time.getDate() : start_time.getDate(); 
      start_date=Y+'-'+M+'-'+D;
      var h = start_time.getHours();//小时
      var m = start_time.getMinutes();//分
      if (h >= 0 && h <= 9) {
        h = "0" + h;
      }
      if (m >= 0 && m <= 9) {
          m = "0" + m;
      }
      start_time=h +':'+ m,
      location=res.data[0].location,
      scale=res.data[0].scale,
      limitation=res.data[0].limitation,
      state=res.data[0].state,
      epi_prevention=res.data[0].epi_prevention,
      amount=res.data[0].amount,

      that.setData({
        id:res.data[0]._id,
        name:res.data[0].name,
        promoter:res.data[0].promoter,
        description:res.data[0].description,
        start_date:start_date,
        start_time:start_time,
        location:res.data[0].location,
        scale:res.data[0].scale,
        limitation:res.data[0].limitation,
        state:res.data[0].state,
        epi_prevention:res.data[0].epi_prevention,
        amount:res.data[0].amount
      })
    })
  },

  updateName(event){
    name = event.detail
  },
  updatePromoter(event){
    promoter = event.detail
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
  updateLocation(event) {
    location=event.detail
  },
  updateScale(event){
    scale = event.detail
  },
  updateLimitation(event){
    limitation = event.detail
  },
  updateState(event){
    state = event.detail
  },
  updateEpi_prevention(event){
    epi_prevention = event.detail
  },
  updateAmount(event){
    amount = parseInt(event.detail)
  },

  //修改数据
  updateData(){
    if(name==''||description==''||start_date==''||start_time==''||location==''
    ||length==0||scale==''||limitation==''||epi_prevention=='') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'error'
      })
    } else {
    start_time=stringToDate(start_date,start_time)
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_updateActInfo',
      // 传给云函数的参数
      data: {
        id:id,
        name:name,
        promoter:promoter,
        description:description,
        start_time:start_time,
        location:location,
        scale:scale,
        limitation:limitation,
        state:state,
        epi_prevention:epi_prevention,
        amount:amount
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
    }
  },
  
  // 删除数据
  deleteData(){
    let that = this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认删除该活动？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
            wx.cloud.callFunction({
              name: 'adm_deleteact',
              data:{
                id:id
              },
            })
            .then(res => {
              //还要删除与该活动相关的报名信息
              wx.cloud.callFunction({
                name:"com",
                data:{
                    type:'delete',
                    collection:"act_res",
                    myWhere:{
                        act_id:that.data.id
                    },
                },
                success(res){
                    console.log("删除成功",res)
                },
                failed(res){
                    console.log("删除失败",res)
                }
              })

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