const DB=wx.cloud.database().collection("announcement");
const app=getApp();
let totalNum=-1;
let annList=[];

Page({
  data:{
    annList:[], //公告列表
  },

  onLoad: function (options) {
    DB.count().then(res=>{
      totalNum=res.total
    })
    this.getAnnList();
  },

  // 加载公告数据
  async getAnnList(){
  
    wx.cloud.callFunction({
      name: 'res_getAnnlist'
    })
    .then(res => {
      console.log("获取数据成功", res)
      annList=res.result.data
      this.setData({
        annList:res.result.data
      })

      // 修改时间的格式
      for(let i=0;i<annList.length;i++) {
        let time=new Date(annList[i].time)
        var Y = time.getFullYear();
        //获取月份（需要填充0）
        var M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1);
        //获取当日日期
        var D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate(); 
        time=Y+'-'+M+'-'+D;

        //修改字符
        let content = annList[i].content.substring(0,20)+'...'
        this.setData({
          [`annList[${i}].time`]:time,
          [`annList[${i}].content`]:content
        })
      }

    })
    .catch(res=>{
      console.log("获取数据失败", res)
    })
  },

  gotoAnn:function(e){
    let index=e.currentTarget.dataset.index
    console.log(index);
    wx.navigateTo({undefined,
      url: "/pages/resident/annDetail/annDetail?ann_id="+this.data.annList[index]._id
   });
  }

})