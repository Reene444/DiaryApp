//修改日期
function setToday(){
  var myDate = new Date();//获取系统当前时间
  var y = myDate.getFullYear(); //年份
  var m = myDate.getMonth()+1; //月份
  var d = myDate.getDate(); //日期
  var H = myDate.getHours();//小时
  var M = myDate.getMinutes();//分
  if(m >=1 && m <=9){
      m = "0" + m;
  }
  if (d >= 1 && d <= 9) {
      d = "0" + d;
  }
  if (H >= 0 && H <= 9) {
      H = "0" + H;
  }
  if (M >= 0 && M <= 9) {
      M = "0" + M;
  }

     var start_date = y + "-" + m + "-" + d
     var start_time = H +':'+ M
     var lim_st_d = y + "-" + m + "-" + d
     var lim_st_t =H +':'+ M
  //console.log("time:",start_date,start_time)
  return start_date.concat("-".concat(start_time))
}
module.exports={
  setToday:setToday,
}