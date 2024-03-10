App({
  //设置全局变量
  globalData: {
    hasLogin: false,
    openid: null,

    //管理员
		isManager: false,
		adm_id:null,
    adm_password: null,
    adm_name: null,
    adm_gender: null,
    adm_phone: null,
    warmth_amount: 0, 

		//居民
		res_id:null,
    res_phone: null,
    res_password: null,
    res_name: null,
    res_gender: null,
    res_birthday: null,
    res_credit_score: 0,
    res_amount: 0,
    res_primary_card: 0,
    res_middle_card: 0,
    res_advanced_card: 0,
  },
   
	conn: {
		closed: false,
		curOpenOpt: {},
		open(opt){
			wx.showLoading({
			  	title: '正在初始化客户端...',
			  	mask: true
			})
			this.curOpenOpt = opt;
			WebIM.conn.open(opt);
			this.closed = false;
		},
		reopen(){
			if(this.closed){
				//this.open(this.curOpenOpt);
				WebIM.conn.open(this.curOpenOpt);
				this.closed = false;
			}
    }
  },     
  onLaunch() {
    //云开发环境初始化
    wx.cloud.init({
     // env:"cloud1-8g9f3ct37376cdc2"
        env:"cloudbase-5geh5lqo8f1bcf96"
    })
    var that = this;

		// 
		// disp.on("em.main.ready", function(){
		// 	calcUnReadSpot();
		// });
		// disp.on("em.chatroom.leave", function(){
		// 	calcUnReadSpot();
		// });
		// disp.on("em.chat.session.remove", function(){
		// 	calcUnReadSpot();
		// });
		// disp.on('em.chat.audio.fileLoaded', function(){
		// 	calcUnReadSpot()
		// });

		// disp.on('em.main.deleteFriend', function(){
		// 	calcUnReadSpot()
		// });
		// disp.on('em.chat.audio.fileLoaded', function(){
		// 	calcUnReadSpot()
    // });
    
  }
})
