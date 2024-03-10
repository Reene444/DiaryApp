const DB=wx.cloud.database().collection("act_res");
const app=getApp();
let id=''; //活动id
let number=0; //报名人数
let resList=[]; //参与人列表
let totalNum=-1;

Page({
  data: {
    resList:[],
  },

  onLoad: function (options) {
    const {act_id}=options;
    id=act_id;
    DB.where({
      act_id:id
    })
    .count()
    .then(res=>{
      totalNum=res.total
    })
    this.getResList();
  },

  // 加载居民数据
  async getResList(){

    wx.showLoading({
      title:'加载中',
    })
  
    wx.cloud.callFunction({
      name: 'adm_getReslist_checkin',
      data: {
        act_id:id
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        resList:res.result.data
      })
      wx.hideLoading()
    })
    .catch(res=>{
      console.log("获取数据失败", res)
      wx.hideLoading()
      wx.showToast({
        icon:'error',
        title: '加载失败',
      })
    })
  },

  // 监听触底事件
  onReachBottom:function(){
    this.getActList();
  },

  // 监听下拉事件
  onPullDownRefresh(){
    totalNum=-1
    // 重置数组
    this.setData({
      actList:[]
    })
    // 发送请求
    this.getResList();
  },

  // 签到
  checkin1:function(e){
    let index=e.currentTarget.dataset.index
    let that=this
    console.log(index);
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_updateCheckinInfo',
      // 传给云函数的参数
      data: {
        id:this.data.resList[index]._id,
        isChecked:true
      },
    })
    .then(res => {
        console.log("修改成功", res)

        //添加消息
        wx.cloud.callFunction({
          name: 'add_noti',
          data:{
            res_phone:this.data.resList[index].res_phone,
            content:"“"+name+"”活动签到成功。",
            type:"活动"
          },
        })
        .then(res => {
            console.log("添加成功", res)
            that.setData({
              [`resList[${index}].isChecked`]:true,
            })
          })
          .catch(console.error)
        
        wx.showToast({
          title: '签到成功',
          icon: 'success',
        })
      })
      .catch(console.error)

      this.onPullDownRefresh()
  },

  checkin2:function(e){
    let index=e.currentTarget.dataset.index
    let that=this
    console.log(index);
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_updateCheckinInfo',
      // 传给云函数的参数
      data: {
        id:this.data.resList[index]._id,
        isChecked:false
      },
    })
    .then(res => {
        console.log("修改成功", res)

        //添加消息
        wx.cloud.callFunction({
          name: 'add_noti',
          data:{
            res_phone:this.data.resList[index].res_phone,
            content:"“"+name+"”活动签到已取消。",
            type:"活动"
          },
        })
        .then(res => {
            console.log("添加成功", res)
            that.setData({
              [`resList[${index}].isChecked`]:false,
            })
          })
          .catch(console.error)
      })
      .catch(console.error)

      this.onPullDownRefresh()
  }
})