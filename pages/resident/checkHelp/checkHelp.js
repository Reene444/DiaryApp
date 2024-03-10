let title='';
let petitioner='';
let level='';
let amount=0;
let amount_sum=0;

let score='';
let award='';
let evaluation='';
let appeal='';

let money=0;//算钱
const app=getApp();

Page({
  data: {

    //帮助信息
    help_id:'',//帮助编号
    helper_phone:'',//帮助人手机号
    start_time:'',//显示的起始时间
    end_time:'',//显示的结束时间
    st_time:'',//计算的起始时间
    ed_time:'',//计算的结束时间
    recordList:[],
    fileList:[],
    picture:{},

    //请求信息
    req_id:'',//请求id
    title:'',
    petitioner:'',
    level:'',//等级，用于发放请求卡
    amount:0,//基础馨币
    amount_sum:0,//基础馨币总值

    //状态
    satisfy:0,//表示是否满意，如果是1表示满意，2表示不满意

    //确认
    score:'',
    award:'',
    evaluation:'',

    //申诉
    appeal:'',
  },

  onLoad: function(options){
    console.log(options.help_id)
    this.setData({
      help_id:options.help_id,
    })
    this.getHelpInfo();
  },

  async getHelpInfo(){
    
    let that=this
    console.log(that.data.help_id)
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
        helper_phone:res.data[0].phone,
        req_id:res.data[0].req_id,
        start_time:time,
        st_time:res.data[0].start_time,
        recordList:res.data[0].recordList,
        picture:res.data[0].picture,
        fileList:that.data.fileList.concat(res.data[0].picture)
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
        ed_time:res.data[0].end_time,
        end_time:time
      })

      DB=wx.cloud.database().collection("request");
      DB.where({
        _id:that.data.req_id
      })
      .get()
      .then(res=>{
        console.log("获取数据成功", res)
        title=res.data[0].title,
        petitioner=res.data[0].petitioner,
        level=res.data[0].level,
        amount=res.data[0].amount

        that.setData({
          title:res.data[0].title,
          petitioner:res.data[0].petitioner,
          level:res.data[0].level,
          amount:res.data[0].amount
        })

        //计算基础馨币总值
        if(res.data[0].settle_way=="时长") {
          var stime = Date.parse(new Date(that.data.st_time));
          var etime = Date.parse(new Date(that.data.ed_time));
          var usedTime = etime - stime; //两个时间戳相差的毫秒数
          //计算出小时数
          var hours = Math.floor(usedTime / (3600 * 1000));
          console.log("小时",hours)
          
          //计算相差分钟数
          var leave1 = usedTime % (3600 * 1000); //计算小时数后剩余的毫秒数
          var minutes = Math.floor(leave1 / (60 * 1000));
          console.log("分钟",minutes)

          amount_sum=amount*hours+amount*minutes/60;//计算总馨币值
          amount_sum=parseFloat(amount_sum.toFixed(2))
          that.setData({
            amount_sum:amount_sum
          })

        } else { //单次计费
          amount_sum=amount
          that.setData({
            amount_sum:amount
          })
        }
      })
    }
    })
  },

  //修改请求状态
  update_state(this_state,this_active) {
    wx.cloud.callFunction({
    name: 'updateReq_state',
    data:{
      id:this.data.req_id,
      state:this_state
    },
  })
  .then(res => {
      console.log("修改请求状态", res)
      var pages = getCurrentPages(); // 获取页面栈
      var prevPage = pages[pages.length - 2]; // 上一个页面
      prevPage.setData({
        state:this_state,
        active: this_active // 设置进入下一个状态
      })
    })
    .catch(console.error)
  },

  //给自己添加消息
  add_me_noti(this_content,this_type) {
    wx.cloud.callFunction({
      name: 'add_noti',
      data:{
        res_phone:app.globalData.res_phone,
        content:this_content,
        type:this_type
      },
    })
    .then(res => {
        console.log("当前用户消息", res)
      })
      .catch(console.error)
  },

  //给帮助人添加消息
  add_helper_noti(this_content,this_type) {
    wx.cloud.callFunction({
      name: 'add_noti',
      data:{
        res_phone:this.data.helper_phone,
        content:this_content,
        type:this_type
      },
    })
    .then(res => {
        console.log("帮助人消息", res)
      })
      .catch(console.error)
  },

  //生成交易记录
  add_tran(this_user,this_amount,this_affair,this_type){
    wx.cloud.callFunction({
      name: 'add_tran',
      data:{
        user:this_user,
        amount:this_amount,
        affair:this_affair,
        type:this_type
      },
    })
    .then(res => {
        console.log("添加成功", res)
      })
      .catch(console.error)
  },

  agree(){
    this.setData({
      satisfy:1
    })
  },

  appeal(){
    this.setData({
      satisfy:2
    })
  },

  back(){
    this.setData({
      satisfy:0
    })
  },

  updateScore(event){
    score=event.detail
  },
  updateAward(event){
    award=event.detail
  },
  updateEvaluation(event){
    evaluation=event.detail
  },

  submit_agree(){ //提交反馈
    if(score==''||award==''||evaluation=='') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'error'
      })
    } else {
    let that=this
    award=parseFloat(award).toFixed(2)
    console.log("基础馨币值",that.data.amount_sum)
    //更新帮助信息
    wx.cloud.callFunction({
      name: 'res_updateHelp_result',
      data:{
        id:that.data.help_id,
        score:score,
        award:parseFloat(award),
        evaluation:evaluation,
        base_amount:that.data.amount_sum //基础馨币值
      },
    })
    .then(res => {
        console.log("更新成功", res)
      })
      .catch(console.error)
console.log(that.data.amount_sum)
console.log(award)
    //扣除金额
    let tmp_amount=parseFloat(award)+that.data.amount_sum//基础+奖励
    console.log(tmp_amount)
    tmp_amount=tmp_amount.toFixed(2)
    wx.cloud.callFunction({
      name: 'res_updateRes_amount',
      data:{
        phone:app.globalData.res_phone,
        amount:-tmp_amount
      },
    })
    .then(res => {
        console.log("更新成功", res)
        //修改全局变量
        app.globalData.res_amount-=parseFloat(tmp_amount);
      })
      .catch(console.error)
    
    //生成交易记录
    that.add_tran(app.globalData.res_phone,tmp_amount,"给“"+title+"”请求的帮助人支付馨币",false)
console.log(tmp_amount)
    //给帮助人增加金额
    wx.cloud.callFunction({
      name: 'res_updateRes_amount',
      data:{
        phone:that.data.helper_phone,
        amount:tmp_amount //金额要重新算
      },
    })
    .then(res => {
        console.log("更新成功", res)
      })
      .catch(console.error)
    
    //生成交易记录
    that.add_tran(that.data.helper_phone,tmp_amount,"帮助完成“"+title+"”请求，获得馨币",true)

    //增加诚信分（如果超过100就不加了）
    //获取帮助者本来的诚信分
    let tmp=0;
    wx.cloud.callFunction({
      name: 'adm_getResInfo',
      data:{
        phone:that.data.helper_phone,
      },
    })
    .then(res => {
      //修改诚信分
      tmp=Math.min(100,res.result.data[0].credit_score+parseInt(score))
      console.log("当前的诚信分",tmp,res.result.data[0].credit_score+parseInt(score))
      //更新
      wx.cloud.callFunction({
        name: 'update_credit',
        data:{
          phone:that.data.helper_phone,
          credit:tmp
        },
      })
      .then(res => {
          console.log("更新成功", res)
        })
        .catch(console.error)
      })
      .catch(console.error)

    //增加帮助人的请求卡
    wx.cloud.callFunction({
      name: 'update_card',
      data:{
        phone:that.data.helper_phone,
        level:level,
        card:1,//卡数量+1
      },
    })
    .then(res => {
      console.log("修改卡数量成功",res)
      //添加消息
      that.add_helper_noti("因帮助完成"+level+"请求，系统赠予您一张"+level+"请求卡。",'互助')
    })
    .catch(console.error)

    //给自己提示信息
    that.add_me_noti('您已提交对“'+that.data.title+'”请求的反馈，互助达成。','互助')

    //给帮助人提示信息
    that.add_helper_noti('您对“'+that.data.title+'”请求的帮助已结束，可以前往请求页面查看反馈。','互助')

    //更新请求状态
    that.update_state('互助达成',5)

    //设置上一个页面的状态
    let pages = getCurrentPages();
    let prevPage = pages[ pages.length - 2 ];  
    prevPage.setData({
        state:'互助达成',
        active:5
    })

    wx.showToast({
      title: '提交反馈成功',
      icon:'success'
    })

    setTimeout(function () {
      wx.navigateBack({delta:1})
    },1000)

  }
  },

  updateAppeal(event){
    appeal=event.detail
  },

  //对于紧急请求
  //管理员可以帮助，设置isOfficial为true
  //如果管理员接纳，直接进入“等待中”
  //管理员点击“开始帮助”，记录开始时间
  //点击“结束帮助”，记录结束时间
  //最终“互助达成”，居民可以查看开始和结束时间

  //申诉，对于申请人和对象，状态先变成“申诉中”，active还是4
  //管理员联系处理，处理完成后，点击“申诉完成”，修改帮助状态回到“结果确认中”
  //重新走正常流程
  submit_appeal(){
    if(appeal=='') {
      wx.showToast({
        title: '输入不能为空',
        icon: 'error'
      })
    } else {
      let that=this

      //添加一条申诉记录
      wx.cloud.callFunction({
        name: 'res_addAppeal',
        data:{
          help_id:that.data.help_id,
          req_id:that.data.req_id,
          res_phone:that.data.petitioner,
          helper_phone:that.data.helper_phone,
          content:appeal,
        },
      })
      .then(res => {
          console.log("添加申诉", res)
        })
        .catch(console.error)

      //更新请求状态
      that.update_state('申诉中',4)

      //给自己提示信息
      that.add_me_noti('您已提交对“'+that.data.title+'”请求的申诉。近期会有管理员联系您确认并展开后续处理，请留意。','申诉')

      //给帮助人提示信息
      that.add_helper_noti('您对“'+that.data.title+'”请求的帮助被申诉。近期会有管理员联系您确认并展开后续处理，请留意。','申诉')

      wx.showToast({
        title: '提交申诉成功',
        icon:'success'
      })
  }
  }

})