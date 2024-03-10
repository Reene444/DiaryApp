const app=getApp()
const appdata=app.globalData
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast'

Page({
  data: {
    actList:[], //活动列表
  //  等级
    option1: [
        { text: '小型活动', value: '小型' },
        { text: '中型活动', value: '中型' },
        { text: '大型活动', value: '大型' },
      ],
      //类别
      option2: [
        { text: '全部状态', value: '全部状态' },
        { text: '审核中', value: '审核中' },
        { text: '报名中', value: '报名中' },
        { text: '活动中', value: '活动中' },
        { text: '活动完成', value: '活动结束' },
      ],
      value1: '小型',
      value2: '全部状态',
  },
  
  onShow: function (options) {
    this.getActList(); //获取列表
  },

  // 监听列表类别修改事件
  onSwitch1Change({ detail }) {
    this.setData({ value1: detail });
    // 修改活动列表
    this.getActList();
  },
  onSwitch2Change({ detail }) {
    this.setData({ value2: detail });
    this.getActList();
  },

  //获取活动列表
  getActList() {
   var myWhere={
      user_id:appdata.res_phone
    }
    var that=this
    console.log("this id:",appdata.res_phone)
    wx.cloud.callFunction({
      name:"com",
      data:{
        collection:'activity',
        type:'get',
        myWhere:myWhere
      },
      success(res){
        console.log("market获取数据成功",res)
        that.setData({
          actList:res.result.data
        })
      },
      failed(res){
        console.log("market获取数据失败",res)
      }
    })
   //  wx.cloud.callFunction({
   //      name: 'res_getActlist',
   //      data:{
   //          user_id:appdata.res_phone
   //      }
   //    })
   //    .then(res => {
   //      console.log("获取数据成功", res)
   //      this.setData({
   //        actList:res.result.data
   //      })
   //    })
   //    .catch(res=>{
   //      console.log("获取数据失败", res)
   //    })
  },

  //进入活动详情页
  gotoAct:function(e){
    let index=e.currentTarget.dataset.index
    wx.navigateTo({
      url: '../actDetail/actDetail?act_id='+this.data.actList[index]._id,
    })
  },


  //悬浮按钮
 
  postAct: function () {
    if(app.globalData.res_credit_score<60) {
      Toast.fail("您的诚信分不足，无法发布活动")
    } else {
    wx.navigateTo({
      url: '/pages/resident/postAct/postAct',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
 
    })
    }
  },

  // onPullDownRefresh(){
  //   let _that = this;
  //   _that.getActList();
  //   console.log(this.data.actList)
  // }
})

