const DB=wx.cloud.database().collection("announcement");
const app=getApp();
let id=''; //公告需要—_id作为主键，是不能换的，也不显示
let title='';
let content='';
let magnitude='';
let time='1900-01-01';

const stringToDate = function(str) {
  str = str.replace(/-/g, "/");
  return new Date(str);
}

Page({
  
  data: {
    ann_id:'',
    ann_title:'',
    ann_content:'',
    ann_magnitude:'',
    ann_time:'1900-01-01',
  },

  onLoad: function(options){
    const {ann_id}=options;
    this.getAnnInfo(ann_id);
    id=ann_id;
    console.log(id)
  },

  // 获取公告信息
  async getAnnInfo(this_id){
    let that=this;
    DB.where({
      _id:this_id
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      title=res.data[0].title,
      content=res.data[0].content,
      magnitude=res.data[0].magnitude,
      time=res.data[0].time;
      var Y =time.getFullYear();
      //获取月份（需要填充0）
      var M = (time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1);
      //获取当日日期
      var D = time.getDate() < 10 ? '0' + time.getDate() : time.getDate(); 
      time=Y+'-'+M+'-'+D;

      that.setData({
        ann_id:res.data[0]._id,
        ann_title:res.data[0].title,
        ann_content:res.data[0].content,
        ann_magnitude:res.data[0].magnitude,
        ann_time:time,
      })
    })
  },
})