var app = getApp();

Page({
  data: {
    actList:[], //活动列表
    active:0
  },
  
  onShow: function (options) {
    this.getActList(); //获取列表
  },

  onChange(event) {
    this.setData({
      active:event.detail.index
    })
    this.getActList()
  },

  //获取活动列表
  getActList() {
    let phone=app.globalData.res_phone;
    console.log(phone)
    if(this.data.active==0) { //我发布的
      wx.cloud.callFunction({
          name: 'res_getActlist_mypost',
          data:{
              phone:phone,
          }
        })
        .then(res => {
          console.log("获取数据成功", res)
          if(res.result.data.length!=0) {
            this.setData({
              actList:res.result.data
            })
          } else {
            this.setData({
              actList:[]
            })
          }
        })
        .catch(res=>{
          console.log("获取数据失败", res)
        })
    } else { //我参加的
      wx.cloud.callFunction({
        name: 'res_getActlist_myenroll',
        data:{
            phone:phone,
        }
      })
      .then(res => {
        console.log("获取数据成功", res)
        if((res.result.data==undefined)&&(res.result.list.length!=0)) {
          this.setData({
            actList:res.result.list
          })
        } else {
          this.setData({
            actList:[]
          })
        }
      })
      .catch(res=>{
        console.log("获取数据失败", res)
      })
    }
  },

  //进入活动详情页
  gotoAct:function(e){
    let index=e.currentTarget.dataset.index
    console.log(this.data.actList)
    if(this.data.active==0) {
      wx.navigateTo({
        url: '../../actDetail/actDetail?act_id='+this.data.actList[index]._id,
      })
    } else {
      wx.navigateTo({
        url: '../../actDetail/actDetail?act_id='+this.data.actList[index].act_id,
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

