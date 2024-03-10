const app=getApp();
const appdata=app.globalData
Page({
    data:{
      res_phone: '',
      res_name: '',
      res_gender: '',
      res_amount: 0,
      info:false
    },

    onShow(){
      var tphone=String(appdata.res_phone)
      this.setData({
        res_phone: tphone.replace(tphone.substring(2,10),'*******'),
        res_name: app.globalData.res_name,
        res_gender: app.globalData.res_gender,
        res_amount: app.globalData.res_amount,
      })
console.log(this.data.res_phone)
      //记录未读的消息个数
      let DB=wx.cloud.database().collection("notification")
      DB
      .where({
        isChecked:false,
        res_phone:tphone
      })
      .count().then(res=>{
        console.log(res)
        if(res.total==0) {
          this.setData({
            info:false
          })
        } else {
          this.setData({
            info:true
          })
        }

      })
    },

    myinfro(){
     wx.navigateTo({
       url: '/pages/resident/others/myinfro/myinfro',
     })
    }


})