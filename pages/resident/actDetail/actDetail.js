const app=getApp();
let id=''; //编号
let title=''; //活动名
let promoter=''; //发起人
let description=''; //活动描述
let start_date='1900-01-01'; //开始日期
let start_time='00:00'; //开始时间
let location='';//活动地点
let level=''; //规模
let state=''; //状态

const stringToDate = function(str1,str2) {
  let str='';
  str=str1+" "+str2;
  str = str.replace(/-/g, "/");
  console.log(str,Date(str))
  return new Date(str);
}

Page({
  data:
  {act: {
    id:'',
    title:'',
    promoter:'',
    description:'',
    start_date:'',
    start_time:'',
    length:1,
    location:'',
    scale:'',
    limitation:0,
    state:'',
    epi_prevention:'',
    amount:0,
    number:0,
    isOfficial:'',

    identity:0, //用户身份：0表示都不是，1表示是发布者，2表示是参与者

  }
  },

  onLoad: function(options){
    const {act_id}=options;
    console.log(act_id)
    this.getActInfo(act_id);
    id=act_id;
  },

  // 获取活动信息
  async getActInfo(this_id){
   //  let that=this;
   //  let DB=wx.cloud.database().collection("activity");
   //  DB.where({
   //    _id:this_id
   //  })
   //  .get()
   //  .then(res=>{

   //  })
   var myWhere={
      _id:this_id
   }
   wx.cloud.callFunction({
      name: 'com',
      data:{
         type:'get',
         collection:'activity',
         myWhere:myWhere
      }
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        act:res.result.data[0]
      })
    })
    .catch(res=>{
      console.log("获取数据失败", res)
    })
  },


  enroll(){
    // 判断目前参与人数有没有达到限制，如果有，则不能报名
    if(number==limitation) {
      wx.showToast({
        title: '人数已达限制，不可报名',
        icon: 'error'
      })
    } else {
      let that=this
      //添加报名信息
      wx.cloud.callFunction({
        name: 'res_addEnroll',
        data: {
          act_id:id,
          res_phone:app.globalData.res_phone,
          res_name:app.globalData.res_name
        },
      })
      .then(res => {
        console.log("添加数据成功", res)
        that.setData({
          number:that.data.number+1,
          identity:2
        })
      })
      .catch(res=>{
        console.log("添加数据失败", res)
        wx.showToast({
          icon:'error',
          title: '报名失败',
        })
      })

      //活动报名人数+1
      wx.cloud.callFunction({
        name: 'res_updateAct_number',
        data:{
          id:id,
          number:1,
        },
      })
      .then(res => {
          console.log("更新成功", res)
        })
        .catch(console.error)
      
      //添加消息
      wx.cloud.callFunction({
        name: 'add_noti',
        data:{
          res_phone:app.globalData.res_phone,
          content:"您已报名“"+name+"”活动，记得按时参加。活动结束后，所需的馨币将自动扣除。",
          type:"活动"
        },
      })
      .then(res => {
          console.log("添加成功", res)
        })
        .catch(console.error)
    }
  },

  //取消报名
  notenroll(){
    let that=this
    //删除报名信息
    wx.cloud.callFunction({
      name: 'res_deleteEnroll',
      data: {
        id:that.data.id,
      },
    })
    .then(res => {
      console.log("删除数据成功", res)
      that.setData({
        number:that.data.number-1,
        identity:0
      })
    })
    .catch(res=>{
      console.log("删除数据失败", res)
      wx.showToast({
        icon:'error',
        title: '取消失败',
      })
    })

    //活动报名人数-1
    wx.cloud.callFunction({
      name: 'res_updateAct_number',
      data:{
        id:id,
        number:-1,
      },
    })
    .then(res => {
        console.log("更新成功", res)
      })
      .catch(console.error)

    //添加消息
    wx.cloud.callFunction({
      name: 'add_noti',
      data:{
        res_phone:app.globalData.res_phone,
        content:"您已取消报名“"+name+"”活动。",
        type:"活动"
      },
    })
    .then(res => {
        console.log("添加成功", res)
      })
      .catch(console.error)
  },

  //开始活动
  start(){
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认开始该活动？请确认管理员已到场，协助完成签到。", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
        //修改活动状态
        wx.cloud.callFunction({
          name: 'res_updateAct_state',
          data:{
            id:id,
            state:"活动中"
          },
        })
        .then(res => {
            console.log("修改成功", res)
            that.setData({
              state:"活动中",
              active:2,
              st_time:new Date()
            })
          })
          .catch(console.error)

        //添加消息
        wx.cloud.callFunction({
          name: 'add_noti',
          data:{
            res_phone:app.globalData.res_phone,
            content:"您发布的“"+name+"”活动已开始，请按要求开展活动。",
            type:"活动"
          },
        })
        .then(res => {
            console.log("添加成功", res)

          })
          .catch(console.error)

        //给所有报名活动的人添加消息
        //先获取报名该活动的列表
        wx.cloud.callFunction({
          name: 'res_getActRes',
          data:{
            act_id:id
          },
        })
        .then(res => {
            console.log("获取数据成功", res)
            let resList=res.result.data;
            for(let i=0;i<resList.length;i++) {
              let phone=resList[i].res_phone;
              //添加消息
              wx.cloud.callFunction({
                name: 'add_noti',
                data:{
                  res_phone:phone,
                  content:"您参加的“"+name+"”活动已开始。请按时找管理员签到，否则会影响您的诚信分。",
                  type:"活动"
                },
              })
              .then(res => {
                  console.log("添加成功", res)
                })
                .catch(console.error)
            }
          })
          .catch(console.error)

        }else if (res.cancel) {
          wx.hideLoading()
      }
    },
  })

  },

  //结束活动
  end() {
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认结束该活动？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
        //修改活动状态
        wx.cloud.callFunction({
          name: 'res_updateAct_state',
          data:{
            id:id,
            state:"活动结束"
          },
        })
        .then(res => {
            console.log("修改成功", res)
            that.setData({
              state:"活动结束",
              active:3
            })
          })
          .catch(console.error)

        //添加消息
        wx.cloud.callFunction({
          name: 'add_noti',
          data:{
            res_phone:app.globalData.res_phone,
            content:"您发布的“"+name+"”活动已结束，记得查收馨币。",
            type:"活动"
          },
        })
        .then(res => {
            console.log("添加成功", res)
          })
          .catch(console.error)

        if(amount!=0) {
        //转移金额，写进交易记录
        if(isOfficial) {//管理员发的活动，则全部进账总馨币
          let tmp=amount*number;
          tmp=parseFloat(tmp.toFixed(2))
          wx.cloud.callFunction({
            name: 'updateManager_amount',
            data:{
              amount:tmp,
            },
          })
          .then(res => {
              console.log("修改成功", res)
            })
            .catch(console.error)

          // 添加交易记录
          wx.cloud.callFunction({
            name: 'add_tran',
            data:{
              user:'系统资金',
              amount:tmp,
              affair:"发布“"+name+"”活动",
              type:true, //true表示收入，false表示支出
            },
          })
          .then(res => {
              console.log("添加成功", res)
            })
            .catch(console.error)
        } else {
          let tmp1=amount*number*0.8
          tmp1=parseFloat(tmp1.toFixed(2));
        //居民发的活动，80%归活动负责人
          wx.cloud.callFunction({
            name: 'res_updateRes_amount',
            data:{
              phone:app.globalData.res_phone,
              amount:tmp1,
            },
          })
          .then(res => {
              console.log("修改成功", res)
            })
            .catch(console.error)
          //修改全局变量
          app.globalData.res_amount=app.globalData.res_amount+tmp1;

          // 添加交易记录
          wx.cloud.callFunction({
            name: 'add_tran',
            data:{
              user:promoter,
              amount:tmp1,
              affair:"发布“"+name+"”活动",
              type:true, //true表示收入，false表示支出
            },
          })
          .then(res => {
              console.log("添加成功", res)
            })
            .catch(console.error)

          // 20%进入总馨币
          let tmp2=amount*number*0.2
          tmp2=parseFloat(tmp2.toFixed(2))
          wx.cloud.callFunction({
            name: 'updateManager_amount',
            data:{
              amount:tmp2,
            },
          })
          .then(res => {
              console.log("修改成功", res)
            })
            .catch(console.error)

          // 添加交易记录
          wx.cloud.callFunction({
            name: 'add_tran',
            data:{
              user:'系统资金',
              amount:tmp2,
              affair:"发布“"+name+"”活动",
              type:true, //true表示收入，false表示支出
            },
          })
          .then(res => {
              console.log("添加成功", res)
            })
            .catch(console.error)
        }
      }

        //所有报名活动的人
        wx.cloud.callFunction({
          name: 'res_getActRes',
          data:{
            act_id:id
          },
        })
        .then(res => {

            console.log("获取数据成功", res)
            let resList=res.result.data;
            for(let i=0;i<resList.length;i++) {
              let phone=resList[i].res_phone;
              if(resList[i].isChecked) { //已签到
                //添加消息
                wx.cloud.callFunction({
                  name: 'add_noti',
                  data:{
                    res_phone:phone,
                    content:"“"+name+"”活动已结束，感谢您的参与。",
                    type:"活动"
                  },
                })
                .then(res => {
                    console.log("添加成功", res)
                  })
                  .catch(console.error)
              } else { //未签到
                //添加消息
                wx.cloud.callFunction({
                  name: 'add_noti',
                  data:{
                    res_phone:phone,
                    content:"“"+name+"”活动已结束，您未按时签到，将被扣除2分诚信分。",
                    type:"活动"
                  },
                })
                .then(res => {
                    console.log("添加成功", res)
                  })
                  .catch(console.error)
                  let credit=parseInt(app.globalData.res_credit_score-2)
                  app.globalData.res_credit_score-=2
                  //扣除诚信分
                  wx.cloud.callFunction({
                    name: 'update_credit',
                    data:{
                      phone:phone,
                      credit:credit,
                    },
                  })
                  .then(res => {
                      console.log("添加成功", res)
                    })
                    .catch(console.error)
              }

              if(amount!=0) {
              let tmp3=parseFloat(amount.toFixed(2))
              //扣除每个人的金额
              wx.cloud.callFunction({
                name: 'res_updateRes_amount',
                data:{
                  phone:phone,
                  amount:-tmp3,
                },
              })
              .then(res => {
                  console.log("修改成功", res)
                })
                .catch(console.error)

              // 添加交易记录
              wx.cloud.callFunction({
                name: 'add_tran',
                data:{
                  user:phone,
                  amount:tmp3,
                  affair:"报名“"+name+"”活动",
                  type:false, //true表示收入，false表示支出
                },
              })
              .then(res => {
                  console.log("添加成功", res)
                })
                .catch(console.error)
              }
            }
          })
          .catch(console.error)
        
        }else if (res.cancel) {
          wx.hideLoading()
      }
    },
  })

  },
})