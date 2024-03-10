// pages/resident/market/postObj/postObj.js
const app=getApp()
const appdata=app.globalData
const objBuyHelp=require("../../../utils/ObjBuyHelp.js")
const dateHelp=require("../../../utils/DateHelp.js")
let fileList=[]

Page({
  data: {
    obj:{

      title:"",//物品名
      content:"",//描述
      time_limit:new Date().toISOString().slice(0, 19).replace('T', ' '),//取货时间
      
    },

    fileList:[],
    selectDatas: ['日常用品','生鲜蔬果','零食速食','电器数码','医疗健康','其他'], //下拉列表的数据
    shows:false,
    indexs:0
  },
  onReady(){
    var str="obj.user_id"
    this.setData({
      [str]:appdata.res_phone
    })
  },
  objNameInput(e){
    var str="obj.title"
    this.setData({
      [str]:e.detail
    })
  },
  objDesInput(e){
    var str="obj.content"
    this.setData({
      [str]:e.detail
    })
  },

  objLocInput(e){
    var str="obj.location"
    this.setData({
      [str]:e.detail
    })
  },
  objMethodInput(e){
    var str="obj.trading"
    this.setData({
      [str]:e.detail,
    })
  },
  objPriceInput(e){
    var str="obj.amount"
    this.setData({
      [str]:parseInt(e.detail)
    })
  },
  objPic(e){
    let n=fileList.length;
    if(n!=0) {//删除原来的图片
      fileList.splice(0, 1)
    }
    //添加新的图片
    const { file } = e.detail;
    fileList.push({ ...file });
    this.setData({ fileList : fileList })
    console.log(fileList)
  },
  selectTaps() {// 点击下拉显示框
    let that=this
    that.setData({
      shows: !this.data.shows,
    });
  },
  // 点击下拉列表
  optionTaps(e) {
    var str="obj.type"
    let index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      indexs: index,
      shows: !this.data.shows,
      [str]:this.data.selectDatas[index]
    });
  },

  check(){
    var str=""
    var flag=1
    if(this.data.obj.name=="")str="请填写商品名"
    else if(this.data.obj.description=="")str="请填写物品描述"
    else flag=0
    if(flag){
       wx.showToast({
      title: str,
      icon:'error'
    })
    return false
    }
    return true
  },

  objAdd(){
    console.log("提交物品数据：",this.data.obj)
    if(!this.check()) return
    let that=this //一定要在外面写
    //弹出提示框
    wx.showModal({
      title: "Confirm", // 提示的标题
      content: "Comfirm to post？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "cancel", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "confirm", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          let time=dateHelp.setToday();
          console.log(that.data.obj.seller_phone)

        wx.showToast({
          title: '上传中',
          icon: 'loading'
        })

        setTimeout( function(){
          //添加物品
          wx.cloud.callFunction({
            name:"com",
            data:{
              type:"add",
              collection:'diary',
              myData:that.data.obj
            },
            success(res){

                console.log("提交物品成功",res)
                wx.showToast({
                  title: '发布物品成功',
                  icon:"success"
                })
                //生成集市消息
                var noi="您的“"+that.data.obj.name+"”上传成功"
                objBuyHelp.noi_resChange(noi,appdata.res_phone)
              
              wx.hideLoading();
              setTimeout(function () {
                wx.navigateBack()//返回上一页
              },2000)
            },
            failed(res){
              console.log("提交物品失败")
              wx.showToast({
                title: '发布物品失败',
                icon:"error"
              })
            }
          })
        },2000)

        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
  }
})