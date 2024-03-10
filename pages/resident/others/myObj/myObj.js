// pages/resident/others/myObj/myObj.js
import Notify from '../../../../miniprogram_npm/@vant/weapp/notify/notify';
const objHelp=require("../../../../utils/ObjBuyHelp.js")
const app=getApp()
const appdata=app.globalData
const db=wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    objList:[],
    active:0
  },
  onShow: function (options) {
    this.getObjList(); //获取列表
  },

  onChange(event) {
    this.setData({
      active:event.detail.index,
      objList:[]
    })
    this.getObjList()
  },

  //获取物品列表
  getObjList() {
    let phone=app.globalData.res_phone;
    let that=this
    console.log(phone)
    if(this.data.active==0) { //我买入的
      wx.cloud.callFunction({
        name: 'res_getObjlist_mybuy',
        data:{
          phone:appdata.res_phone
        },
      })
      .then(res => {
        console.log("market获取数据成功",res)
        that.setData({
          objList:res.result.list
        })
      })
      .catch(err => {
        console.error(err)
      })
      
    } else { //我卖出的
      wx.cloud.callFunction({
        name:"com",
        data:{
          collection:'object',
          type:'get',
          myWhere:({
            seller_phone:appdata.res_phone
          })
        },
        success(res){

          console.log("market获取数据成功",res)
          that.setData({
            objList:res.result.data
          })
        },
        failed(res){
          console.log("market获取数据失败",res)
        }
      })
    }
  },
  gotoObj(e){
    let index=e.currentTarget.dataset.index
    console.log(index)
    console.log(this.data.objList)
    if(this.data.active==0) {
      wx.navigateTo({
        url: '../../marketDetail/marketDetail?id='+this.data.objList[index].obj_id,
      })
    } else {
      wx.navigateTo({
        url: '../../marketDetail/marketDetail?id='+this.data.objList[index]._id,
      })
    }
  },

  //保留
  //下架物品
  deleteRls(e){
    var id=e.currentTarget.dataset.id
    var that=this
    var obj={}
    objHelp.getObjDetail(id).then((res)=>{obj=res}).then(()=>{
    console.log("下架物品:",obj)
    if(obj.state=="等待购买中") {
    wx.cloud.callFunction({
      name:"com",
      data:{
        type:'delete',
        collection:'object',
        myWhere:{
          _id:id
        }
      },
      success(res){
        console.log("删除数据成功",res)
        wx.showToast({
          title: '已下架',
          icon:'success'
        })
        //生成集市消息
        var noi="您的"+obj.name+"下架"
        objHelp.noi_resChange(noi,appdata.res_phone)
      },
      failed(res){
        console.log("删除数据失败")
      }
    })
  } else {
    Notify('有人购买的物品无法下架');
  }
      
  })

  },
  //取消购买
  deleteBuy(e){
    var id=e.currentTarget.dataset.id
    wx.showModal({
      title:'是否取消购买',
      content:'将会扣去诚信分10分',
      success(res){
        if(res.confirm){
         objHelp.deleteBuy(id) 
        }
      }
    })
     
  },
})