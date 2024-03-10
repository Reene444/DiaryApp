const DB=wx.cloud.database().collection("resident");
const app=getApp();
let phone='';
let name='';
let gender='';
let birthday='1900-01-01';
let credit_score=100;

Page({
  data:{
    res_phone:'',
    res_name:'',
    res_gender:'',
    res_birthday:'1900-01-01',
    res_credit_score:0,
    req_id:'', //请求id
    help_id:'', //帮助id
    helper_phone:'', //帮助人手机号
  },

  onLoad: function(options){
    console.log(options)
    const {res_phone}=options.res_phone; //貌似{}这种操作只能用一次
    this.setData({
      req_id:options.req_id,
      help_id:options.help_id,
      helper_phone:options.helper_phone
    })
    console.log(phone,this.data.helper_phone)
    phone=res_phone;
    this.getResInfo();
  },

  async getResInfo(){ //获取居民信息
    let that=this;
    DB.where({
      phone:that.data.helper_phone
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      name=res.data[0].name,
      gender=res.data[0].gender,
      birthday=res.data[0].birthday;
      var Y =birthday.getFullYear();
      //获取月份（需要填充0）
      var M = (birthday.getMonth() + 1 < 10 ? '0' + (birthday.getMonth() + 1) : birthday.getMonth() + 1);
      //获取当日日期
      var D = birthday.getDate() < 10 ? '0' + birthday.getDate() : birthday.getDate(); 
      birthday=Y+'-'+M+'-'+D;
      credit_score=res.data[0].credit_score;

      that.setData({
        res_phone:res.data[0].phone,
        res_name:res.data[0].name,
        res_gender:res.data[0].gender,
        res_birthday:birthday,
        res_credit_score:res.data[0].credit_score,
      })
    })
  },
  
  //修改请求状态
  async update_state(this_state,this_active) {
    let that=this
    wx.cloud.callFunction({
    name: 'updateReq_state',
    data:{
      id:that.data.req_id,
      state:this_state
    },
  })
  .then(res => {
      console.log("修改请求状态", res)
      var pages = getCurrentPages(); // 获取页面栈
      var prevPage = pages[pages.length - 2]; // 上一个页面
      prevPage.setData({
        state:this_state,
        active: this_active // 设置进入下一个状态
      })
    })
    .catch(console.error)
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

  //给帮助人添加消息
  add_helper_noti(this_content) {
    let that=this
    wx.cloud.callFunction({
      name: 'add_noti',
      data:{
        res_phone:that.data.helper_phone,
        content:this_content,
        type:'互助'
      },
    })
    .then(res => {
        console.log("帮助人消息", res)
      })
      .catch(console.error)
  },
  
  check(){ //确认
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认接受帮助？帮助开始后不能暂停或调换哦", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          //修改状态
          that.update_state("准备中",2)
          //添加消息
          that.add_me_noti("您已接纳“"+name+"”对您的帮助，帮助即将开始。")
          //给帮助人添加消息
          that.add_helper_noti("您对"+that.data.helper_phone+"的帮助已被确认，请按要求执行帮助。")
          wx.showToast({
            title: '您已接纳帮助',
            icon: 'success',
            duration: 2600,
          })

          //因为直接返回的时候会有延迟，数据还没更新
          //设置定时器
          setTimeout(function () {
              wx.navigateBack({delta:1})
          },500)
        }else if (res.cancel) {
          wx.hideLoading()
        }
    },
  })
  },

  refuse(){ //拒绝
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认拒绝帮助？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
        //修改状态
        that.update_state("等待帮助中",0)

        //添加消息
        that.add_me_noti("您已拒绝“"+name+"”的帮助，请求将回到等待帮助状态。")

        //删除此条帮助记录
        wx.cloud.callFunction({
          name: 'delete_help',
          data:{
            id:that.data.help_id,
          },
        })
        .then(res => {
            console.log("删除成功", res)
          })
          .catch(console.error)

        //给帮助人添加消息
        that.add_helper_noti("您对“"+that.data.helper_phone+"”的帮助已被拒绝。")

        wx.showToast({
          title: '您已拒绝帮助',
          icon: 'success',
          duration: 2600,
        })

        //因为直接返回的时候会有延迟，数据还没更新
        //设置定时器
        setTimeout(function () {
            wx.navigateBack({delta:1})
        },500)
        }else if (res.cancel) {
          wx.hideLoading()
      }
    },
  })

  },
})