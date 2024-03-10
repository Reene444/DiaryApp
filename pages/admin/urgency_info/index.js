const DB=wx.cloud.database().collection("request");
const app=getApp();
let id=''; //请求编号
let title=''; //请求标题
let petitioner=''; //发布人手机号
let time=''; //发布时间
let content=''; //请求内容
let time_limit=''; //时间限制
let demand='';//具体要求
let level=''; //请求等级
let isUrgent=''; //紧急程度
let type=''; //请求类型
let settle_way='';//结算方式
let amount=0; //基础馨币
let state='';//请求状态
let isOfficial='';

Page({
  data: {
    title:'',
    petitioner:'',
    content:'',
    time_limit:'',
    demand:'',
    level:'',
    isUrgent:'',
    type:'',
    settle_way:'',
    amount:0,
    state:'',
    isOfficial:'',

    //设置步骤条
    steps: [
      {
        text: '发布请求',
      },
      {
        text: '帮助申请',
      },
      {
        text: '申请通过',
      },
      {
        text: '帮助开始',
      },
      {
        text: '帮助结束',
      },
      {
        text: '互助达成',
      },
    ],
    active: 0,
    identity:0, //表示管理员与该请求的关系，1表示是帮助人，0表示不是
    help_id:'', //帮助的id
    help_isOfficial:'',//帮助是否是官方的
    helper_phone:'',//帮助人手机号
    updatePic: false
  },

  onLoad: function(options){
    const {req_id}=options;
    this.getReqInfo(req_id);
    id=req_id;
  },

  // 获取请求信息
  async getReqInfo(this_id){
    let that=this;
    let DB=wx.cloud.database().collection("request");
    DB.where({
      _id:this_id
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      title=res.data[0].title,
      petitioner=res.data[0].petitioner,
      title=res.data[0].title,
      content=res.data[0].content,
      time_limit=res.data[0].time_limit,
      demand=res.data[0].demand,
      level=res.data[0].level,
      isUrgent=res.data[0].isUrgent,
      type=res.data[0].type,
      settle_way=res.data[0].settle_way,
      amount=res.data[0].amount,
      state=res.data[0].state,
      isOfficial=res.data[0].isOfficial

      //查找自己是不是该请求的帮助人
      DB=wx.cloud.database().collection("req_user");
      DB.where({
        req_id:this_id,
        phone:app.globalData.adm_phone
      }).get()
      .then(res=>{
        console.log("查找成功",res)
        if(res.data.length!=0) {
        that.setData({
          identity:1,
          help_id:res.data[0]._id, //帮助id
          help_isOfficial:res.data[0].isOfficial //帮助是否是官方的
        })
      }
      })

      console.log('身份',that.data.identity)

      //查找帮助的信息
      DB=wx.cloud.database().collection("req_user");
        DB.where({
          req_id:this_id,
        }).get()
        .then(res=>{
          console.log("查找成功",res)
          if(res.data.length!=0) {
          that.setData({
            help_id:res.data[0]._id, //帮助id
            help_isOfficial:res.data[0].isOfficial //帮助是否是官方的
          })
          if(res.data[0].picture.size!=undefined) { //判断之前是否上传过图片
            that.setData({
              updatePic:true //帮助id
            })
          }
        }
        })

      //管理员的处理流程会简单一些
      if(state=="等待帮助中") {
        that.setData({
            active:0,
        })
      } else if(state=="准备中") {
            that.setData({
            active:2
            })
      } else if(state=="帮助中") {
          that.setData({
          active:3
          })
      } else if(state=="互助达成") {
        that.setData({
        active:5
        })
      }

      that.setData({
        id:res.data[0]._id,
        petitioner:res.data[0].petitioner,
        title: res.data[0].title,
        content: res.data[0].content,
        time_limit: res.data[0].time_limit,
        demand: res.data[0].demand,
        level: res.data[0].level,
        isUrgent: res.data[0].isUrgent,
        type: res.data[0].type,
        settle_way:res.data[0].settle_way,
        amount:res.data[0].amount,
        state: res.data[0].state,
        isOfficial: res.data[0].isOfficial
      })
    })
  },

  //修改请求状态
  update_state(this_state,this_active) {
    wx.cloud.callFunction({
    name: 'updateReq_state',
    data:{
      id:id,
      state:this_state
    },
  })
  .then(res => {
      console.log("修改请求状态", res)
      let that=this
      that.setData({
        active:this_active,
        state:this_state
      })
    })
    .catch(console.error)
  },

  //给请求发布人添加消息
  add_petitioner_noti(this_content) {
    wx.cloud.callFunction({
      name: 'add_noti',
      data:{
        res_phone:this.data.petitioner,
        content:this_content,
        type:'互助'
      },
    })
    .then(res => {
        console.log("请求人消息", res)
      })
      .catch(console.error)
  },

  //等待帮助中：“提供帮助”，提示：提交申请、确认，添加通知
  //准备中：帮助者，“开始帮助”，进入下一个状态，提示：确认
        //不是帮助者，“已有人帮助”，不可点击
  //帮助中：帮助者，“帮助记录”、“结束帮助”，帮助记录：开始时间、时长、过程记录，结束帮助：证明图片、确认结束
        //不是帮助者：“已有人帮助”，不可点击
  //互助达成：帮助者，“查看帮助记录”
        //不是帮助者：“帮助达成”，不可点击

  help(){ //提供帮助
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认提供帮助？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          //添加帮助信息
          wx.cloud.callFunction({
            name: 'add_help',
            data: {
              req_id:id,
              phone:app.globalData.adm_phone,
              isOfficial:true,//官方执行帮助
            },
          })
          .then(res => {
            console.log("添加数据成功", res)
            that.setData({
              active:2, //修改状态
              identity:1 //修改其为帮助者
            })
          })
          .catch(res=>{
            console.log("添加数据失败", res)
            wx.showToast({
              icon:'error',
              title: '数据加载失败',
            })
          })
          //修改请求状态
          that.update_state("准备中",2)

          //给帮助的请求人添加消息
          that.add_petitioner_noti('管理员已接纳您的“'+title+'”请求，即将开始执行帮助。')

        }else if (res.cancel) {
          wx.hideLoading()
        }
      },
    })
  },

  start(){ //帮助人开始帮助
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认开始帮助？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          //修改活动状态
          that.update_state('帮助中',3)
          //给帮助的请求人添加消息
          that.add_petitioner_noti('您的“'+title+'”请求已经开启帮助进程。')
          console.log(that.data.help_id)
          //记录开始时间
          wx.cloud.callFunction({
            name: 'update_st_help',
            data:{
              id:that.data.help_id,
            },
          })
          .then(res => {
              console.log("更新成功", res)
            })
            .catch(console.error)
        }else if (res.cancel) {
          wx.hideLoading()
      }
    },
  })
  },

  record(){ //帮助人记录过程
    //跳转记录信息页面
    wx.navigateTo({
      url: '../urg_record/index?req_id='+id+'&title='+title
    })
  },

  updatePicture(){ //上传图片
    wx.navigateTo({
      url: '../urg_pic/index?help_id='+this.data.help_id
    })
  },

  end(){ //帮助人结束帮助
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认已完成请求人要求的所有事项？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          //更新帮助，设置结束时间
          wx.cloud.callFunction({
            name: 'update_ed_help',
            data:{
              id:that.data.help_id,
            },
          })
          .then(res => {
              console.log("更新成功", res)
            })
            .catch(console.error)

          //修改活动状态
          that.update_state('互助达成',5)

          //给帮助的请求人添加消息
          that.add_petitioner_noti('您的“'+title+'”请求已经结束帮助进程，可以前往对应页面浏览帮助记录。')
        }else if (res.cancel) {
          wx.hideLoading()
        }
    },
  })
  },

  help_check_result(){ //浏览结果，不能改动
    wx.navigateTo({
      url: '../urg_check/index?help_id='+this.data.help_id
    })
  },

})