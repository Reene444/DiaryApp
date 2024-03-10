let picture='';

Page({
  data: {
    help_id:'',//帮助编号
    fileList:[]
  },

  onLoad: function(options){
    this.setData({
      help_id:options.help_id,
    })
  },


  //点击图片上传后执行
  afterRead(event) {
    const { file } = event.detail;
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.cloud.uploadFile({
      cloudPath: this.data.help_id+'_help.png',
      filePath: file.url,
      success: res=> {
        const { fileList = [] } = this.data.fileList;
        fileList.push({ ...file, url: res.fileID });
        this.setData({ fileList });
      },
    });
  },

  //添加图片
  addPicture(){
    let that=this
    console.log(that.data.fileList)
    //弹出提示框
    wx.showModal({
      title: "确认提示", // 提示的标题
      content: "确认上传图片？上传后不可修改哦", // 提示的内容
      showCancel: true, // 是否显示取消按钮，默认true
      cancelText: "取消", // 取消按钮的文字，最多4个字符
      cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
      confirmText: "确定", // 确认按钮的文字，最多4个字符
      confirmColor: "#FFC65B", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
      success: function (res) {
        if (res.confirm) {
          wx.cloud.callFunction({
          name: 'res_updateHelp_pic',
          data:{
            id:that.data.help_id,
            picture:that.data.fileList[0],
          },
          })
          .then(res => {
              console.log("更新成功", res)

              //设置上一个页面的状态
              let pages = getCurrentPages();
              let prevPage = pages[ pages.length - 2 ];  
              prevPage.setData({
                  updatePic:true
              })

              wx.showToast({
                title: '上传成功',
                icon:'success'
              })
              
              setTimeout(function () {
                wx.navigateBack({delta:1})
              },500)
            })
            .catch(console.error)
        }else if (res.cancel) {
          wx.hideLoading()
        }
    },
  })
    
  }
})