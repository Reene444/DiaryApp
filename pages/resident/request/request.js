// pages/user/help/help.js
var app = getApp();
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    emerg_reqList:[], //紧急请求列表
    reqList:[], //请求列表
    //等级
    option1: [
        { text: '初级请求', value: '初级' },
        { text: '中级请求', value: '中级' },
        { text: '高级请求', value: '高级' }
      ],
      //类别
      option2: [
        { text: '全部类别', value: '全部类别' },
        { text: '家政服务', value: '家政服务' },
        { text: '教学活动', value: '教学活动' },
        { text: '协助管理', value: '协助管理' },
        { text: '装配维修', value: '装配维修' },
        { text: '物件取送', value: '物件取送' },
        { text: '信息宣传', value: '信息宣传' },
        { text: '其他', value: '其他' },
      ],
      value1: '初级',
      value2: '全部类别',
      show: false, //设置是否展示紧急请求
  },
  
  onShow: function (options) {
    this.setData({
      emerg_reqList:[],
      reqList:[],
    })
    this.getEmergReqList(); //随机获取一个紧急请求
    this.getReqList(); //获取列表
  },

  // 监听列表类别修改事件
  onSwitch1Change({ detail }) {
    this.setData({ value1: detail });
    // 修改请求列表
    this.getReqList();
  },
  onSwitch2Change({ detail }) {
    this.setData({ value2: detail });
    this.getReqList();
  },

  //获取紧急请求
  getEmergReqList() {
    let DB=wx.cloud.database().collection("diary");
    DB.aggregate().sample({
      size: 10
    })
    .then(res => {
      console.log( res)
      this.setData({
        emerg_reqList:res.list
      })
      let that=this
      if(this.data.emerg_reqList.length!=0) {
          that.setData({
              show:true
          })
      }
    })
    .catch(res=>{
      console.log("获取数据失败", res)
    })

    // wx.cloud.callFunction({
    //     name: 'res_getEmergReqlist',
    //   })
    //   .then(res => {
    //     console.log("获取数据成功", res)
    //     this.setData({
    //       emerg_reqList:res.result.list
    //     })
    //     console.log(this.data.emerg_reqList.length)
    //     let that=this
    //     if(this.data.emerg_reqList.length!=0) {
    //         that.setData({
    //             show:true
    //           })
    //     }
    //     console.log(this.data.show)
    //   })
    //   .catch(res=>{
    //     console.log("获取数据失败", res)
    //   })
  },

  //获取请求列表
  getReqList() {
    wx.cloud.callFunction({
        name: 'res_getReqlist',
        data:{
            level:this.data.value1,
            type:this.data.value2,
        }
      })
      .then(res => {
        console.log("获取数据成功", res)
        this.setData({
          reqList:res.result.data
        })
      })
      .catch(res=>{
        console.log("获取数据失败", res)
      })
  },

  // 点击紧急请求
  toEmergy(){
    wx.navigateTo({
      url: '../reqDetail/reqDetail?req_id=' + this.data.emerg_reqList[0]._id,
    })
  },

    // 点击请求
    toReq:function(e){
      let index=e.currentTarget.dataset.index
      wx.navigateTo({
        url: '../reqDetail/reqDetail?req_id=' + this.data.reqList[index]._id,
      })
    },

  //搜索框文本内容显示
  inputBind: function(event) {
    this.setData({
        inputValue: event.detail.value
    })
    console.log('bindInput' + this.data.inputValue)

},

  //悬浮按钮
 
  adddetial: function () {
 
      wx.navigateTo({
        url: '/pages/resident/postReq/postReq',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
  
      })
 
  },

})