const appdata=getApp().globalData;
const shopHelp=require("../../../../utils/ShopHelp.js")

Page({
  
  data: {
    primary_card:appdata.res_primary_card,
    middle_card:appdata.res_middle_card,
    advanced_card:appdata.res_advanced_card,
    amount:appdata.res_amount,

    card:{
      'primary_card':"初级",
      'middle_card':"中级",
      'advanced_card':"高级"
    }
  },

  onShow(){
    this.setData({
      primary_card:appdata.res_primary_card,
      middle_card:appdata.res_middle_card,
      advanced_card:appdata.res_advanced_card,
      amount:appdata.res_amount,
    })
  },
  /**
   * 购买帮助卡
   */

  //充值
  click_xin(e){
    let that=this
    var value=e.currentTarget.dataset.value
    wx.showModal({
      title: "充值",
      content:'您已选择充值'+value+'元，点击确认支付',
      confirmText:'确认',
      cancelText:'取消',
      success(res){
        if(res.confirm){
          shopHelp.recharge(value).then(()=>{
              console.log("充值成功")
              wx.showToast({
              title: '充值成功',
              icon:'success'
            })
          })
          //重新设置页面内容
          that.setData({
            amount:appdata.res_amount
          })
        }
        else console.log("取消充值")
      }
    })
  },

  //买请求卡
  click_card(e){
    //先判断居民拥有的馨币是否足够购买
    var value=e.currentTarget.dataset.value
    let that=this
    var card=this.data.card
    wx.showModal({
      title: "购买"+card[value]+"请求卡",
      content:'点击确认购买',
      confirmText:'确认',
      cancelText:'取消',
      success(res){
        if(res.confirm){
          shopHelp.pay_for_card(value).then(()=>{
          wx.showToast({
            title: '支付中',
            icon:'loading'
          })
          //重新设置页面内容
          setTimeout(function(){
            that.setData({
              primary_card:appdata.res_primary_card,
              middle_card:appdata.res_middle_card,
              advanced_card:appdata.res_advanced_card,
              amount:appdata.res_amount,
            })

            setTimeout(function(){
              wx.showToast({
              title: '购买成功',
              icon:'success'
            })
            },200)
            
          },200)
        })
        }
        else console.log("取消购买请求卡")
      }
    })
  }
})