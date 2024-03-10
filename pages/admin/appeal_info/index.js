const app=getApp();

Page({
  data: {
    id:'',//申诉id
    appeal_content:'',//申诉内容

    //帮助信息
    help_id:'',//帮助编号
    helper_phone:'',//帮助人手机号
    start_time:'',//显示的起始时间
    end_time:'',//显示的结束时间
    recordList:[],
    fileList:[],
    picture:{},

    //请求信息
    req_id:'',//请求id
    title:'',//请求标题
    content:'',
    time_limit:'',
    demand:'',
    isUrgent:'',
    type:'',
    settle_way:'',
    res_phone:'',//请求人（申诉人）手机号
    level:'',//等级    content:'',
    time_limit:'',
    demand:'',
    level:'',
    isUrgent:'',
    type:'',
    settle_way:'',
    amount:0,//基础馨币
  },

  onLoad: function(options){
    console.log(options)
    this.setData({
      id:options.app_id,
    })
    this.getHelpInfo();
  },

  //获取信息
  async getHelpInfo(){
    let that=this
    //获取申诉信息
    let DB=wx.cloud.database().collection("appeal");
    DB.where({
      _id:that.data.id,
    }).get()
    .then(res=>{
      console.log("查找成功",res)
      that.setData({
        appeal_content:res.data[0].content,
        res_phone:res.data[0].res_phone,
        req_id:res.data[0].req_id,
        helper_phone:res.data[0].helper_phone,
        help_id:res.data[0].help_id
      })

      //查找帮助信息
      DB=wx.cloud.database().collection("req_user");
      DB.where({
        _id:that.data.help_id,
      }).get()
      .then(res=>{
        console.log("查找成功",res)

        let time=new Date(res.data[0].start_time)
        var Y = time.getFullYear();
        //获取月份（需要填充0）
        var M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1);
        //获取当日日期
        var D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate(); 
        // 获取时间
        var h = time.getHours();//小时
        var m = time.getMinutes();//分
        if (h >= 0 && h <= 9) {
          h = "0" + h;
        }
        if (m >= 0 && m <= 9) {
            m = "0" + m;
        }
        time=Y+'-'+M+'-'+D+' '+h +':'+ m;

        that.setData({
          helper_phone:res.data[0].phone,
          req_id:res.data[0].req_id,
          start_time:time,
          recordList:res.data[0].recordList,
          picture:res.data[0].picture,
          fileList:that.data.fileList.concat(res.data[0].picture),
          amount_sum:res.data[0].base_amount
        })

        time=new Date(res.data[0].end_time)
        var Y = time.getFullYear();
        //获取月份（需要填充0）
        var M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1);
        //获取当日日期
        var D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate(); 
        // 获取时间
        var h = time.getHours();//小时
        var m = time.getMinutes();//分
        if (h >= 0 && h <= 9) {
          h = "0" + h;
        }
        if (m >= 0 && m <= 9) {
            m = "0" + m;
        }
        time=Y+'-'+M+'-'+D+' '+h +':'+ m;
        that.setData({
          end_time:time
        })
      })

      //查找请求信息
      DB=wx.cloud.database().collection("request");
      DB.where({
        _id:that.data.req_id
      })
      .get()
      .then(res=>{
        console.log("获取数据成功", res)
        
        that.setData({
          title:res.data[0].title,
          content:res.data[0].content,
          time_limit:res.data[0].time_limit,
          demand:res.data[0].demand,
          level:res.data[0].level,
          isUrgent:res.data[0].isUrgent,
          type:res.data[0].type,
          settle_way:res.data[0].settle_way,
          amount:res.data[0].amount
        })
    })
    
    })
    
  },

  finish(){//申诉处理完成
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认处理完成，并完成所有的修改工作？确认后，该申诉会被删除", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          //修改请求状态
          wx.cloud.callFunction({
            name: 'updateReq_state',
            data:{
              id:that.data.req_id,
              state:"结果确认中"
            },
          })
          .then(res => {
              console.log("修改状态成功", res)
            })
            .catch(console.error)

          //删除申诉
          wx.cloud.callFunction({
            name: 'adm_delete_appeal',
            data:{
              id:that.data.id,
            },
          })
          .then(res => {
              console.log("删除成功", res)
            })
            .catch(console.error)

          // 给申诉人（发布请求人）添加消息
          wx.cloud.callFunction({
            name: 'add_noti',
            data:{
              res_phone:that.data.res_phone,
              content:"您对于“"+that.data.title+"”请求的申诉已处理完成，请到请求页面查看并确认。",
              type:"申诉"
            },
          })
          .then(res => {
              console.log("添加成功", res)
            })
            .catch(console.error)

          wx.hideLoading();

          wx.showToast({
            title: '处理完成',
            icon: 'success'
          })
          //计时器
          setTimeout(function () {
            wx.navigateBack({delta:1})
          },1000)        
          
        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
  }

})