const app=getApp()
const appdata=app.globalData
const objBuyHelp=require("../../../utils/ObjBuyHelp.js")
const dateHelp=require("../../../utils/DateHelp.js")
let fileList=[]

Page({
  data: {
    obj_id:'',
    obj:{
      _id:"",
      name:"",
      description:"",
      seller_phone:"",
      amount:0,
      time:"",
      location:"",
      state:"",
      type:"",
      trading:"",
      picture:{},
    }, 

    fileList:[],
    flag:false, //判断有没有改变过图片
    selectDatas: ['日常用品','生鲜蔬果','零食速食','电器数码','医疗健康','其他'], //下拉列表的数据
    shows:false,
    indexs:0
  },

  onLoad: function(options){
    const {obj_id}=options;
    this.getObjInfo(obj_id);
  },

  async getObjInfo(this_id) {
    let that=this
    //获取物品信息
    objBuyHelp.getObjDetail(this_id).then((res)=>{
      console.log("物品detail:",res)
      this.setData({
          obj:res
      })
      //设置类型
      switch(res.type) {
        case '日常用品':
           this.setData({
             indexs:0
           })
           break;
        case '生鲜蔬果':
          this.setData({
            indexs:1
          })
          break;
        case '零食速食':
          this.setData({
            indexs:2
          })
          break;
        case '电器数码':
          this.setData({
            indexs:3
          })
          break;
        case '医疗健康':
          this.setData({
            indexs:4
          })
          break;
        case '其他':
          this.setData({
            indexs:5
          })
          break;
        default:
           this.setData({
            indexs:0
           })
      }
      //推入已经有了的图片
      if(fileList.length!=0) {
        fileList.length = 0; //先清空
      }
      if(res.picture.size!=null) {
        fileList.push(res.picture)
        this.setData({
          fileList:fileList
        })
      }
      console.log(this.data.obj)
    })
  },

  objNameInput(e){
    var str="obj.name"
    this.setData({
      [str]:e.detail
    })
  },
  objDesInput(e){
    var str="obj.description"
    this.setData({
      [str]:e.detail
    })
  },
  objTimeInput(e){
    var str="obj.time"
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
    this.setData({
      flag:true //把图片标记为修改过
    })
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

  //判空
  check(){
    var str=""
    var flag=1
    if(this.data.obj.name=="")str="请填写商品名"
    else if(this.data.obj.description=="")str="请填写物品描述"
    else if(this.data.obj.time=="")str="请填写取货时间"
    else if(this.data.obj.location=="")str="请填写取货地点"
    else if(this.data.obj.trading=="")str="请选择交易方式"
    else if(this.data.obj.amount==0)str="价格不能为0"
    else if(fileList.length==0)str="请上传图片"
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

  //修改数据
  updateData(){
    console.log("提交物品数据：",this.data.obj)
    if(!this.check()) return
    let that=this
    let obj=that.data.obj

    let time=dateHelp.setToday();

    if(that.data.flag==true) {
      wx.cloud.uploadFile({
        cloudPath: that.data.obj.seller_phone+'_'+time+'_object.png',
        filePath: fileList[0].url,
        success: res=> {
          fileList[0].url=res.fileID
          console.log(fileList[0])
          var str="obj.picture"
          that.setData({
            [str]: fileList[0]
          })
          console.log(that.data.obj.picture)
        },
      });

      wx.showToast({
        title: '上传中',
        icon: 'loading'
      })
    }

    setTimeout( function(){

      //修改物品
      wx.cloud.callFunction({
        name:'adm_updateObjInfo',
        data:{
          id:obj._id,
          name:obj.name,
          description:obj.description,
          seller_phone:obj.seller_phone,
          amount:obj.amount,
          time:obj.time,
          location:obj.location,
          state:obj.state,
          type:obj.type,
          trading:obj.trading,
          picture:obj.picture,
        },
      })
      .then(res => {
        console.log("修改物品信息",res)
        wx.showToast({
          title: '修改信息成功',
          icon:"success"
        })
      })
      .catch(console.error)
      wx.hideLoading();
    },1000)
  },
  
  // 删除物品
  deleteData(){
    let that=this
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认删除物品信息？", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
            wx.cloud.callFunction({
              name: 'adm_deleteobj',
              data:{
                id:that.data.obj._id
              },
            })
            .then(res => {
                //还要删除与该物品相关的购买信息
                wx.cloud.callFunction({
                  name:"com",
                  data:{
                      type:'delete',
                      collection:"obj_res",
                      myWhere:{
                          obj_id:that.data.obj._id
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

            setTimeout( function(){
              wx.navigateBack(); //返回上一页
            },500)

        } else if (res.cancel) {
            wx.hideLoading()
        }
      },
  })
  },
})