const app=getApp();
let id=''; //编号
let name=''; //活动名
let promoter=''; //发起人
let description=''; //活动描述
let start_date='1900-01-01'; //开始日期
let start_time='00:00'; //开始时间
let length=0;//活动时长
let scale=''; //规模
let limitation=0; //人数限制
let state=''; //状态
let epi_prevention=''; //防疫要求
let transaction=''; //交易方式
let amount=0; //金额

let birthday='';
let res_name='';
let res_gender='';
let res_birthday='1900-01-01';
let res_credit=0;

const stringToDate = function(str1,str2) {
  let str='';
  str=str1+" "+str2;
  str = str.replace(/-/g, "/");
  console.log(str,Date(str))
  return new Date(str);
}

Page({
  data: {
    id:'',
    name:'',
    promoter:'',
    description:'',
    start_date:'1900-01-01',
    start_time:'00:00',
    length:1,
    scale:'',
    limitation:0,
    state:'',
    epi_prevention:'',
    transaction:'',
    amount:0,

    res_phone:'',
    res_name:'',
    res_gender:'',
    res_birthday:'',
    res_credit:''
  },

  onLoad: function(options){
    const {act_id}=options;
    this.getActInfo(act_id);
    id=act_id;
  },

  // 获取活动信息
  async getActInfo(this_id){
    let that=this;
    let DB=wx.cloud.database().collection("activity");
    await DB.where({
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
      scale=res.data[0].scale,
      limitation=res.data[0].limitation,
      state=res.data[0].state,
      epi_prevention=res.data[0].epi_prevention,
      transaction=res.data[0].transaction,
      amount=res.data[0].amount,

      that.setData({
        id:res.data[0]._id,
        name:res.data[0].name,
        promoter:res.data[0].promoter,
        description:res.data[0].description,
        start_date:start_date,
        start_time:start_time,
        scale:res.data[0].scale,
        limitation:res.data[0].limitation,
        state:res.data[0].state,
        epi_prevention:res.data[0].epi_prevention,
        transaction:res.data[0].transaction,
        amount:res.data[0].amount
      })

    DB=wx.cloud.database().collection("resident");
    DB.where({
      phone: promoter
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res),
      res_name=res.data[0].name,
      res_gender=res.data[0].gender,
      birthday =res.data[0].birthday;
      var Y =birthday.getFullYear();
      //获取月份（需要填充0）
      var M = (birthday.getMonth() + 1 < 10 ? '0' + (birthday.getMonth() + 1) : birthday.getMonth() + 1);
      //获取当日日期
      var D = birthday.getDate() < 10 ? '0' + birthday.getDate() : birthday.getDate(); 
      res_birthday=Y+'-'+M+'-'+D;
      res_credit=res.data[0].credit_score,
      that.setData({
        res_phone:res.data[0].phone,
        res_name:res.data[0].name,
        res_gender:res.data[0].gender,
        res_birthday:res_birthday,
        res_credit:res.data[0].credit_score,
      })
    })
    })
  },

  //审批通过：修改状态，添加通知
  updateData(){
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认审批通过该活动？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
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
            scale:scale,
            limitation:limitation,
            state:'报名中',
            epi_prevention:epi_prevention,
            transaction:transaction,
            amount:amount
          },
        })
        .then(res => {
            console.log("修改成功", res)
          })
          .catch(console.error)

        wx.cloud.callFunction({
          // 添加消息
          name: 'add_noti',
          // 传给云函数的参数
          data: {
            res_phone:promoter,
            content:"您的“"+name+"”活动已被审批通过。",
            type:"活动",
          },
        })
        .then(res => {
            console.log("添加消息成功", res)
            wx.showToast({
              title: '审批成功',
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
  
  // 审批不通过：删除活动，添加通知
  deleteData(){
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认审批不通过该活动？该活动信息将随即被删除", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
           //删除活动信息
            wx.cloud.callFunction({
              name: 'adm_deleteact',
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
              // 添加消息
              wx.cloud.callFunction({
                name: 'add_noti',
                // 传给云函数的参数
                data: {
                  res_phone:promoter,
                  content:"您的“"+name+"”活动审批不通过，活动信息被删除。",
                  type:"活动",
                },
              })
              .then(res => {
                  console.log("添加消息成功", res)
                  wx.showToast({
                    title: '审批不通过',
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