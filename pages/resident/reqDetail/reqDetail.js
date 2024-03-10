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
    identity:0, //表示用户与该请求的关系，1表示是发布人，2表示是帮助人
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

      // 发布人就是自己
      if(petitioner==app.globalData.res_phone) {
        that.setData({
          identity:1
        })
      } else { //查找自己是不是该请求的帮助人
        DB=wx.cloud.database().collection("req_user");
        DB.where({
          req_id:this_id,
          phone:app.globalData.res_phone
        }).get()
        .then(res=>{
          console.log("查找成功",res)
          if(res.data.length!=0) {
          that.setData({
            identity:2,
            help_id:res.data[0]._id, //帮助id
            help_isOfficial:res.data[0].isOfficial //帮助是否是官方的
          })
        }
        })
      }
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
            help_id:res.data[0]._id,
            help_isOfficial:res.data[0].isOfficial //帮助是否是官方的
          })
          if(res.data[0].picture.size!=undefined) { //判断之前是否上传过图片
            that.setData({
              updatePic:true //帮助id
            })
          }
        }
        })

      if(state=="等待帮助中") {
        that.setData({
            active:0,
        })
      } else if(state=="帮助确认中") {
          that.setData({
            active:1
          })
      } else if(state=="准备中") {
            that.setData({
            active:2
            })
      } else if(state=="帮助中") {
          that.setData({
          active:3
          })
      } else if(state=="结果确认中"||state=="申诉中") {
        that.setData({
        active:4
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
    wx.cloud.callFunction({
      name: 'add_noti',
      data:{
        res_phone:this.data.helper_phone,
        content:this_content,
        type:'互助'
      },
    })
    .then(res => {
        console.log("帮助人消息", res)
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

  //等待帮助中：如果是发布者，“等待帮助中”，不可点击
            //如果不是发布者，“提供帮助”，提示：提交申请、确认，添加通知
  //帮助确认中：如果是发布者，“查看帮助者信息”，弹窗、确认帮助或拒绝帮助，确认：进下一个状态，拒绝：回上一个状态
            //不是发布者，但申请了帮助，可以”取消帮助“，回上一个状态
            //不是发布者，也没有申请，“已有人帮助”，不可点击
  //准备中：如果是发布者，“准备中”，不可点击
        //是帮助者，“开始帮助”，进入下一个状态，提示：确认
        //其他，“已有人帮助”，不可点击
  //帮助中：如果是发布者，“浏览帮助进程”，弹窗、开始时间、中间记录
        //帮助者，“帮助记录”、“结束帮助”，帮助记录：开始时间、时长、过程记录，结束帮助：证明图片、确认结束
        //其他：“已有人帮助”，不可点击
  //结果确认中：发布者，“帮助已完成，查看信息”，跳转：开始时间、结束时间、过程记录、图片，给出评分、奖励馨币，确认后判断馨币数，进入下一个状态
        //帮助者，“等待请求人确认”，不可点击
        //其他，“帮助已完成”，不可点击
  //互助达成：发布者，“查看帮助记录”
        //帮助者，“查看帮助记录”
        //其他，“互助达成”

  help(){ //提供帮助
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认提供帮助？不按要求完成会被扣除诚信分哦", // 提示的内容
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
              phone:app.globalData.res_phone,
              isOfficial:false, //因为管理员帮助和居民帮助后面的流程不一样，所以传个值进行判断
            },
          })
          .then(res => {
            console.log("添加数据成功", res)
            that.setData({
              active:1, //修改状态
              identity:2 //修改其为帮助者
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
          that.update_state("帮助确认中",1)

        }else if (res.cancel) {
          wx.hideLoading()
        }
      },
    })
  },

  nothelp(){ //取消帮助
    let that=this
    //删除帮助信息
    wx.cloud.callFunction({
      name: 'delete_help',
      data: {
        id:id,
      },
    })
    .then(res => {
      console.log("删除数据成功", res)
      that.setData({
        identity:0 //不帮助后变为其他人
      })
    })
    .catch(res=>{
      console.log("删除数据失败", res)
      wx.showToast({
        icon:'error',
        title: '取消失败',
      })
    })
    //修改请求状态
    that.update_state('等待帮助中',0)
  },

  check_helper(){ //检查帮助人信息并确认
    let that=this
    //官方帮助不会进入这个状态
    //查找帮助信息
    wx.cloud.callFunction({
      // 云函数名称
      name: 'getHelpInfo',
      // 传给云函数的参数
      data: {
        id:id,
      },
    })
    .then(res => {
        console.log("查询成功", res)
        that.setData({
          helper_phone:res.result.data[0].phone
        })

        //执行跳转
        wx.navigateTo({
          url: '../helperDetail/helperDetail?res_phone='+res.result.data[0].phone+'&req_id='+id+'&help_id='+that.data.help_id+'&helper_phone='+that.data.helper_phone
        })
      })
      .catch(console.error)
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
          //添加消息
          that.add_me_noti('您帮助的“'+title+'”请求已经开始，记得按要求执行哦。')
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
      url: '../helpRecord/helpRecord?help_id='+this.data.help_id+'&title='+title
    })
  },

  check_process(){ //请求人检查过程
    wx.navigateTo({
      url: '../checkRecord/checkRecord?help_id='+this.data.help_id+'&title='+title
    })
  },

  updatePicture(){ //上传图片
    wx.navigateTo({
      url: '../helpPicture/helpPicture?help_id='+this.data.help_id
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
          that.update_state('结果确认中',4)
          //添加消息
          that.add_me_noti('您已结束对“'+title+'”请求的帮助，请耐心等待请求人确认。')
          //给帮助的请求人添加消息
          that.add_petitioner_noti('您的“'+title+'”请求已经结束帮助进程，请前往对应页面确认。')
        }else if (res.cancel) {
          wx.hideLoading()
        }
    },
  })
  },

  check_result(){ //请求人检查结果，并设置奖励，如果不满意的话可以申请申诉
    console.log(this.data.help_id)
    wx.navigateTo({
      url: '../checkHelp/checkHelp?help_id='+this.data.help_id
    })
  },

  help_check_result(){ //帮助人浏览结果，不能改动
    console.log(this.data.help_id)
    wx.navigateTo({
      url: '../checkResult/checkResult?help_id='+this.data.help_id
    })
  },

})