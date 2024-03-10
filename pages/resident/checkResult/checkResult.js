let title='';
let petitioner='';
let level='';
let amount=0;
let amount_sum=0;
let sum=0;

let score='';
let award='';
let evaluation='';

const app=getApp();

Page({
  data: {

    //帮助信息
    help_id:'',//帮助编号
    helper_phone:'',//帮助人手机号
    start_time:'',//显示的起始时间
    end_time:'',//显示的结束时间
    recordList:[],
    fileList:[],
    picture:{},
    isOfficial:true,

    //请求信息
    req_id:'',//请求id
    title:'',
    petitioner:'',
    level:'',//等级，用于发放请求卡
    amount:0,//基础馨币
    amount_sum:0,//基础馨币总值

    sum:0,//基础+奖励
    //确认
    score:'',
    award:'',
    evaluation:'',
  },

  onLoad: function(options){
    console.log(options.help_id)
    this.setData({
      help_id:options.help_id,
    })
    this.getHelpInfo();
  },

  //获取互助的全部信息
  async getHelpInfo(){
    let that=this
    //查找帮助的信息
    let DB=wx.cloud.database().collection("req_user");
    DB.where({
      _id:that.data.help_id,
    }).get()
    .then(res=>{
      console.log("查找成功",res)

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
        helper_phone:res.data[0].phone,
        req_id:res.data[0].req_id,
        start_time:time,
        recordList:res.data[0].recordList,
        picture:res.data[0].picture,
        fileList:that.data.fileList.concat(res.data[0].picture),
        score:res.data[0].score,
        award:res.data[0].award,
        evaluation:res.data[0].evaluation,
        amount_sum:res.data[0].base_amount,
        isOfficial:res.data[0].isOfficial
      })

      console.log(that.data.recordList.length)

      sum=parseFloat(that.data.amount_sum)+parseFloat(that.data.award)
      that.setData({
        sum:parseFloat(sum)
      })

      time=new Date(res.data[0].end_time)
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
        end_time:time
      })

    })
  },

})