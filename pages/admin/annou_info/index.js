const DB=wx.cloud.database().collection("announcement");
const app=getApp();
let id=''; //_id作为主键，是不能换的，也不显示
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
    end:Date.now(),
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

  updateTitle(event){
    title = event.detail
  },
  updateContent(event){
    content = event.detail
  },
  updateMagnitude(event){
    magnitude = event.detail
  },
  updateTime(event) {
    time=stringToDate(event.detail.value)
    let that=this
    that.setData({
      ann_time: event.detail.value
    })
  },

  //修改数据
  updateData(){
    wx.cloud.callFunction({
      // 云函数名称
      name: 'adm_updateAnnInfo',
      // 传给云函数的参数
      data: {
        id:id,
        title:title,
        content:content,
        magnitude:magnitude,
        time:time,
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
  },
  
  // 删除数据
  deleteData(){
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认删除公告信息？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
            wx.cloud.callFunction({
              name: 'adm_deleteann',
              data:{
                id:id
              },
            })
            .then(res => {
                console.log("删除成功", res)
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                })

                setTimeout(function(){
                  wx.navigateBack();
                },200)
              })
              .catch(console.error)
            wx.hideLoading();
        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
  },
})