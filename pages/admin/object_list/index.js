const DB=wx.cloud.database().collection("object")
const app=getApp()
let totalNum=-1;

Page({
  data:{
    objList:[] //物品列表
  },

  onShow: function (options) {
    this.setData({
      objList:[]
    })
    DB.count().then(res=>{
      totalNum=res.total
    })
    this.getObjList();
  },

  // 加载物品数据
  async getObjList(){
    let len=this.data.objList.length

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
      name: 'adm_getObjlist_withlimit',
      data: {
        len:len
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        objList:this.data.objList.concat(res.result.data)
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
    this.getObjList();
  },

    // 监听下拉事件
    onPullDownRefresh(){
      // 重置数组
      this.setData({
        objList:[]
      })
      // 发送请求
      this.getObjList();
    }
})