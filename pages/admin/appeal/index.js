const DB=wx.cloud.database().collection("appeal")
const app=getApp()
let totalNum=-1;
let appList=[];

Page({
  data:{
    appList:[] //申诉列表
  },

  onShow: function (options) {
    this.setData({
      appList:[]
    })
    DB.count().then(res=>{
      totalNum=res.total
    })
    this.getAppList();
  },

  // 加载申诉数据
  async getAppList(){
    let len=this.data.appList.length
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
      name: 'adm_getApplist_withlimit',
      data: {
        len:len
      },
    })
    .then(res => {
      console.log("获取数据成功", res)
      appList=res.result.data
      this.setData({
        appList:this.data.appList.concat(res.result.data)
      })

      // 修改时间的格式
      for(let i=0;i<appList.length;i++) {
        let time=new Date(appList[i].time)
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
        this.setData({
        [`appList[${i}].time`]:time
        }) //注意这里的标点符号
    }
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
    this.getAppList();
  },

    // 监听下拉事件
    onPullDownRefresh(){
      // 重置数组
      this.setData({
        appList:[]
      })
      // 发送请求
      this.getAppList();
    }
    
})