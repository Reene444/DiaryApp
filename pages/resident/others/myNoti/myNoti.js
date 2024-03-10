var app = getApp();
let notiList=[];

Page({
  data: {
    notiList:[], //消息列表
    //等级
    option1: [
        { text: '互助', value: '互助' },
        { text: '活动', value: '活动' },
        { text: '集市', value: '集市' },
        { text: '申诉', value: '申诉'},
        { text: '其他', value: '其他'}
      ],
      value1: '互助',
  },
  
  onShow: function (options) {
    this.getNotiList(); //获取列表
  },

  // 监听列表类别修改事件
  onSwitch1Change({ detail }) {
    this.setData({ value1: detail });
    this.getNotiList();
  },

  //获取消息列表
  getNotiList() {
    let that=this
    console.log(app.globalData.res_phone)
    wx.cloud.callFunction({
        name: 'res_getNotilist',
        data:{
            type:that.data.value1,
            phone:app.globalData.res_phone
        }
      })
      .then(res => {
        console.log("获取数据成功", res)
        notiList=res.result.data
        that.setData({
          notiList:res.result.data
        })

        // 修改时间的格式
        for(let i=0;i<notiList.length;i++) {
            let time=new Date(notiList[i].time)
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
            [`notiList[${i}].time`]:time
            }) //注意这里的标点符号
        }

      })
      .catch(res=>{
        console.log("获取数据失败", res)
      })

      //延时将通知设置为已读
      setTimeout(function () {
        that.updateNoti()
      },1000)
  },

  updateNoti(){
    let that=this
    let DB=wx.cloud.database().collection('notification')
    //把该类型下的数据设置称为已阅
    DB.where({
      type:that.data.value1,
      res_phone:app.globalData.res_phone
    })
    .update({
      data:{
        isChecked:true
      }
    })
  }
})

