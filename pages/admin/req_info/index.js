const DB=wx.cloud.database().collection("request");
const app=getApp();
let id=''; //请求id
let title=''; //请求标题
let petitioner=''; //发布人手机号
let time=''; //发布时间
let content=''; //请求内容
let time_limit=''; //时间限制
let demand='';//具体要求
let level=''; //请求等级
let isUrgent=''; //紧急程度
let type=''; //请求类型
let settle_way='';//结算方式
let amount=0; //基础馨币
let state='';//请求状态

Page({
  data: {
    id:'',
    title:'',
    petitioner:'',
    content:'',
    time_limit:'',
    demand:'',
    level:'',
    isUrgent:'',
    type:'',
    settle_way:'',
    amount:0,
    state:'',
  },

  onLoad: function(options){
    //获取请求id
    const {req_id}=options;
    this.getReqInfo(req_id);
    id=req_id;
  },

  //获取请求信息
  async getReqInfo(this_id){
    let that=this;
    DB.where({
      _id:this_id
    })
    .get()
    .then(res=>{
      console.log("获取数据成功", res)
      title=res.data[0].title,
      petitioner=res.data[0].petitioner,
      title=res.data[0].title,
      content=res.data[0].content,
      time_limit=res.data[0].time_limit,
      demand=res.data[0].demand,
      level=res.data[0].level,
      isUrgent=res.data[0].isUrgent,
      type=res.data[0].type,
      settle_way=res.data[0].settle_way,
      amount=res.data[0].amount
      that.setData({
        petitioner:res.data[0].petitioner,
        title: res.data[0].title,
        content: res.data[0].content,
        time_limit: res.data[0].time_limit,
        demand: res.data[0].demand,
        level: res.data[0].level,
        isUrgent: res.data[0].isUrgent,
        type: res.data[0].type,
        settle_way:res.data[0].settle_way,
        amount:res.data[0].amount
      })
    })
  },

  updateTitle(event){
    title = event.detail
  },
  updateContent(event){
    content = event.detail
  },
  updateTimeLimit(event) {
    time_limit=event.detail
  },
  updateDemand(event) {
    demand=event.detail
  },
  updateLevel(event){
    level=event.detail
  },
  updateisUrgent(event){
    isUrgent=event.detail
    console.log(isUrgent)
  },
  updateType(event){
    type = event.detail
  },
  updateSettle(event){
    settle_way = event.detail
  },
  updateAmount(event){
    amount = event.detail
  },

    // 修改数据
    updateData(){
      if(title==''||content==''||time_limit==''||demand==''
      ||level==''||type==''||settle_way==''||amount=='') {
        wx.showToast({
          title: '内容不能为空',
          icon: 'error'
        })
      } else if(isUrgent==true && level!="高级") {
        wx.showToast({
          title: '只有高级请求能设置紧急',
          icon:'none'
        })
      } else {
        //执行修改
        wx.cloud.callFunction({
          // 云函数名称
          name: 'adm_updateReqInfo',
          // 传给云函数的参数
          data: {
            id:id,
            title:title,
            content:content,
            time_limit:time_limit,
            demand:demand,
            level:level,
            isUrgent:isUrgent,
            type:type,
            settle_way:settle_way,
            amount:amount
          },
        })
        .then(res => {
            console.log("修改成功", res)
            wx.showToast({
              title: '修改成功',
              icon: 'success',
            })
          })
          .catch(console.error)
      }
    },

  // 删除数据
  deleteData(){
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认删除该请求？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          //删除请求
            wx.cloud.callFunction({
              name: 'adm_deletereq',
              data:{
                id:id
              },
            })
            .then(res => {
                //还要删除与该请求相关的帮助信息
                wx.cloud.callFunction({
                  name:"com",
                  data:{
                      type:'delete',
                      collection:"req_user",
                      myWhere:{
                          req_id:that.data.id
                      },
                  },
                  success(res){
                      console.log("删除成功",res)
                  },
                  failed(res){
                      console.log("删除失败",res)
                  }
                })

                console.log("删除成功", res)
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                })
              })
              .catch(console.error)
            wx.hideLoading();
        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
}
})