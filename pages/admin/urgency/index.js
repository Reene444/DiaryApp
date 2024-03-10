const DB=wx.cloud.database().collection("request")
const app=getApp()
let urgList=[]

Page({
  data:{
    urgList:[] //请求列表
  },

  onShow: function (options) {
    this.setData({
      urgList:[]
    })

    this.getUrgList();
  },

  // 加载紧急请求数据
  async getUrgList(){

    wx.showLoading({
      title:'加载中'
    })
  
    wx.cloud.callFunction({
      name: 'adm_getUrglist_withlimit',
    })
    .then(res => {
      console.log("获取数据成功", res)
      this.setData({
        urgList:res.result.data
      })
      urgList=res.result.data
      
      // 修改时间的格式
      for(let i=0;i<urgList.length;i++) {
        let time=new Date(urgList[i].time)
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
        [`urgList[${i}].time`]:time
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
    this.getUrgList();
  },

    // 监听下拉事件
    onPullDownRefresh(){
      // 重置数组
      this.setData({
        urgList:[]
      })

      this.getUrgList();
    }
})