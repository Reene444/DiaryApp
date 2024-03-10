const DB=wx.cloud.database().collection("communication")
const app=getApp()
let totalNum=-1;

Page({
  data:{
    comList:[], //意见列表

    option1: [
      { text: '集市', value: '集市' },
      { text: '建议', value: '建议' },
    ],
    value1: '建议',
  },

  onLoad: function (options) {
    DB.count().then(res=>{
      totalNum=res.total
    })
    console.log(totalNum)
    this.getComList();
  },

  // 监听列表类别修改事件
  onSwitch1Change({ detail }) {
    this.setData({ value1: detail });
    this.getComList();
  },

  // 加载交流数据
  async getComList(){
    let len=this.data.comList.length
    if(totalNum==len) {
      wx.showToast({
        title: '数据已加载完',
      })
      return
    }
    wx.showLoading({
      title:'加载中'
    })
  
    wx.cloud.callFunction({
      name: 'adm_getComlist_withlimit',
      data: {
        len:len,
        type:this.data.value1
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        comList:res.result.data
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
    this.getComList();
  },

    // 监听下拉事件
    onPullDownRefresh(){
      // 重置数组
      this.setData({
        comList:[]
      })
      // 发送请求
      this.getComList();
    }
    
})