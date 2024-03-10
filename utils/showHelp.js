function toast(msg){
  wx.showToast({
    title: msg.title,
    icon: msg.icon,
  })
}
module.exports={
  toast:toast
}