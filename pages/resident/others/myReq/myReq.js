var app = getApp();
let reqList=[]

Page({
  data: {
    reqList:[], //请求列表
    active:0
  },
  
  onShow: function (options) {
    this.getReqList(); //获取请求列表
  },

  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    this.getReqList()
  },

  //获取请求列表
  getReqList() {
    let phone=app.globalData.res_phone;
    if(this.data.active==0) { //我发布的
      wx.cloud.callFunction({
          name: 'res_getReqlist_mypost',
          data:{
              phone:phone,
          }
        })
        .then(res => {
          console.log("获取数据成功", res)
          let that=this
          if(res.result.data.length!=0) {
            reqList=res.result.data
            that.setData({
              reqList:res.result.data
            })

            // 修改时间的格式
            for(let i=0;i<reqList.length;i++) {
              let time=new Date(reqList[i].time)
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
              [`reqList[${i}].time`]:time
              }) //注意这里的标点符号
          }
          } else {
            this.setData({
              reqList:[]
            })
          }
        })
        .catch(res=>{
          console.log("获取数据失败", res)
        })
    } else { //我帮助的
      wx.cloud.callFunction({
        name: 'res_getReqlist_myhelp',
        data:{
            phone:phone,
        }
      })
      .then(res => {
        let that=this
        console.log("获取数据成功", res)
        if((res.result.data==undefined)&&(res.result.list.length!=0)) {
          reqList=res.result.list

          that.setData({
            reqList:res.result.list
          })

          // 修改时间的格式
          for(let i=0;i<reqList.length;i++) {
            let time=new Date(reqList[i].req[0].time)
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
            [`reqList[${i}].req[0].time`]:time
            }) //注意这里的标点符号
        }
        } else {
          this.setData({
            reqList:[]
          })
        }
      })
      .catch(res=>{
        console.log("获取数据失败", res)
      })
    }
  },

  //进入请求详情页
  gotoReq:function(e){
    let index=e.currentTarget.dataset.index
    console.log(this.data.reqList)
    if(this.data.active==0) {
      wx.navigateTo({
        url: '../../reqDetail/reqDetail?req_id='+this.data.reqList[index]._id,
      })
    } else {
      wx.navigateTo({
        url: '../../reqDetail/reqDetail?req_id='+this.data.reqList[index].req_id,
      })
    }
  },

  //搜索框文本内容显示
  inputBind: function(event) {
    this.setData({
        inputValue: event.detail.value
    })
    console.log('bindInput' + this.data.inputValue)
},

     /**
     * 搜索执行按钮
     */
    query: function(event) {

      var that = this

      /**
       * 提问帖子搜索API
       * keyword string 搜索关键词 ; 这里是 this.data.inputValue
       * start int 分页起始值 ; 这里是 0
       */
      wx.request({
          url: 'https://localhost/proj_online_class/server/public/index.php/forum/forum/get_issue_search/' + this.data.inputValue + /0/,
          data: {
              inputValue: this.data.inputValue
          },
          method: 'GET',
          success: function(res) {
              console.log(res.data)
              var searchData = res.data
              that.setData({
                  searchData
              })

              /**
               * 把 从get_issue_searchAPI 
               * 获取 提问帖子搜索 的数据 设置缓存
               */
              wx.setStorage({
                  key: 'searchLists',
                  data: {
                      searchLists: res.data
                  }
              })

              /**
               * 设置 模糊搜索
               */
              if (!that.data.inputValue) {
                  //没有搜索词 友情提示
                  wx.showToast({
                      title: '请重新输入',
                      image: '../../picture/tear.png',
                      duration: 2000,
                  })
              } else if (searchData.search.length == 0) {
                  //搜索词不存在 友情提示
                  wx.showToast({
                      title: '关键词不存在',
                      image: '../../picture/tear.png',
                      duration: 2000,
                  })
              } else {
                  //提取题目关键字 与搜索词进行匹配
                  var searchIndex = searchData.search.length
                  var d = 0;
                  for (var i = 0; i <= searchIndex - 1; i++) {

                      var searchTitle = searchData.search[d].title
                      console.log(searchTitle)
                      d = d + 1;

                      for (var x = 0; x <= searchTitle.length; x++) {
                          for (var y = 0; y <= searchTitle.length; y++) {
                              var keyWord = searchTitle.substring(x, y);
                              console.log(keyWord)
                          }
                      }

                      /**
                       * 根据关键词 跳转到 search搜索页面
                       */
                      wx.navigateTo({
                          url: '../search/search',
                      })
                  }
              }
          }
      })
  },

})

