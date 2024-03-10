const DB=wx.cloud.database().collection("account_book");
const app=getApp();
let id=''; //编号
let account_event=''; //事件
let account_amount=0; //金额
let account_time='';//时间

const stringToDate = function() {
  let str='';
  str=str1+" "+str2;
  str = str.replace(/-/g, "/");
  console.log(str,Date(str))
  return new Date(str);
}

Page({
  data: {
    id:'',
    account_event:'',
    account_time:'',
    account_amount:'',
  },

  onLoad: function(options){
    const {account_id}=options;
    this.getAccountInfo(account_id);
    id=account_id;
  },

  // 获取账目信息
  async getAccountInfo(this_id){
    let that=this;
    DB.where({
      _id:this_id
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      account_event=res.data[0].event,
      account_amount=res.data[0].amount;
      var tmp_time=res.data[0].time
      var Y =tmp_time.getFullYear();
      var M = (tmp_time.getMonth() + 1 < 10 ? '0' + (tmp_time.getMonth() + 1) : tmp_time.getMonth() + 1);
      var D = tmp_time.getDate() < 10 ? '0' + tmp_time.getDate() : tmp_time.getDate(); 
      account_time=Y+'-'+M+'-'+D;
      var h = tmp_time.getHours();//小时
      var m = tmp_time.getMinutes();//分
      if (h >= 0 && h <= 9) {
        h = "0" + h;
      }
      if (m >= 0 && m <= 9) {
          m = "0" + m;
      }
      account_time=account_time+' '+h +':'+ m,
      console.log(account_time)
      that.setData({
        id:res.data[0]._id,
        account_event:res.data[0].event,
        account_amount:res.data[0].amount,
        account_time:account_time
      })
    })
  },

})