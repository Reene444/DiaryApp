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
      req_id:options.req_id,
      title:options.title,
    })
    this.getHelpInfo();
  },

  async getHelpInfo(){
    let that=this
    console.log(that.data.req_id)
    //查找帮助的信息
    let DB=wx.cloud.database().collection("req_user");
    DB.where({
      req_id:that.data.req_id,
    }).get()
    .then(res=>{
      console.log("成功",res)
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

  updateRecord(event){
    new_record = event.detail
  },
  //添加消息
  addRecord(){
    console.log(new_record)
    let that=this
    wx.cloud.callFunction({
      name: 'res_updateHelp_record',
      data:{
        id:that.data.req_id,
        new_record:new_record
      },
    })
    .then(res => {
        console.log("修改成功", res)
        wx.showToast({
          title: '添加成功',
          icon: 'success',
        })
        that.setData({
          recordList:that.data.recordList.concat(new_record),
          this_record:''
        })
      })
      .catch(console.error)
  }
})