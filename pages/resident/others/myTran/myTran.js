var app = getApp();
let tranList=[];

Page({
  data: {
    tranList:[], //交易列表
    
    option1: [
        { text: '收入', value: true },
        { text: '支出', value: false },
      ],
      value1: true,
  },
  
  onShow: function (options) {
    this.getTranList(); //获取列表
  },

  // 监听列表类别修改事件
  onSwitch1Change({ detail }) {
    this.setData({ value1: detail });
    this.getTranList();
  },

  //获取交易列表
  getTranList() {
    let that=this
    console.log(that.data.value1)
    wx.cloud.callFunction({
        name: 'res_getTranlist',
        data:{
            type:that.data.value1,
            user:app.globalData.res_phone
            //系统交易记录的区别就是这里是“系统资金”
        }
      })
      .then(res => {
        console.log("获取数据成功", res)
        tranList=res.result.data
        that.setData({
          tranList:res.result.data
        })

        // 修改时间的格式
        for(let i=0;i<tranList.length;i++) {
            let time=new Date(tranList[i].time)
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
            [`tranList[${i}].time`]:time
            }) //注意这里的标点符号
        }

      })
      .catch(res=>{
        console.log("获取数据失败", res)
      })
  },


})

