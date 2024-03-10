let new_record='';
Page({
  data: {
    title:'',//请求标题
    help_id:'',//帮助编号
    start_time:'',
    time:'',
    recordList:[],
    this_record:''
  },

  onLoad: function(options){
    this.setData({
      help_id:options.help_id,
      title:options.title,
    })
    this.getHelpInfo();
  },

  async getHelpInfo(){
    let that=this
    //查找帮助的信息
    let DB=wx.cloud.database().collection("req_user");
    DB.where({
      _id:that.data.help_id,
    }).get()
    .then(res=>{
      console.log("查找成功",res)
      if(res.data.length!=0) {

      let time=new Date(res.data[0].start_time)
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

      that.setData({
        time:res.data[0].start_time,
        start_time:time,
        recordList:res.data[0].recordList
      })
    }
    })
  },
})