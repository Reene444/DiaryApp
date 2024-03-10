const app=getApp()
const appdata=app.globalData

let len=0
let dataend=0

Page({
    data: {
      objList:[],
      //类别
      option1: [
        { text: '全部类别', value: '全部类别' },
        { text: '日常用品', value: '日常用品' },
        { text: '生鲜蔬果', value: '生鲜蔬果' },
        { text: '零食速食', value: '零食速食' },
        { text: '电器数码', value: '电器数码' },
        { text: '医疗健康', value: '医疗健康' },
        { text: '其他',value:'其他'}
      ],
      //交易方式
     option2: [
        { text: '交易方式', value: '全部' },
        { text: '馨币', value: '馨币' },
        { text: '现金', value: '现金' },
      ],
      value1:'全部类别',
      value2:'全部'
    },
  
    onShow: function () {
      this.getdata()
    },

  getdata(len){
    let that=this
    var myWhere={
      user_id:appdata.res_phone
    }
    console.log("this id:",appdata.res_phone)
    wx.cloud.callFunction({
      name:"com",
      data:{
        collection:'diary',
        type:'get',
        myWhere:myWhere
      },
      success(res){
        console.log("market获取数据成功",res)
        that.setData({
          objList:res.result.data
        })
      },
      failed(res){
        console.log("market获取数据失败",res)
      }
    })
  },

    gotodetail(e){
      console.log(e)
      var id=e.currentTarget.dataset.id
     wx.navigateTo({
       url: '/pages/resident/marketDetail/marketDetail'+"?id="+id
     })
    },

    // 悬浮按钮
    adddetial: function () {
      wx.navigateTo({
        url: '/pages/resident/postObj/postObj',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    },
 
  
  
  })