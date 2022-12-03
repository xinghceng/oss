// pages/phone/phone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    codebtn:'发送验证码',
    disabled:"",
  },
phone(e)
{
  //  获取手机号
  let phone=e.detail.value;
  let reg=/^[1][3,5,4,7,8][0-9]{9}$/;
  if(!reg.test(phone))
  {
    wx.showToast({
      title: '手机号不符合规则',
    })
    return false;
  }
  this.setData({
    phone:phone
  })
},
sendCode()
{
   let phone=this.data.phone;
   var Time=60
   var that=this
   wx.request({
     url: 'http://www.blog1.com/index.php/api/code',
     data:{
       phone:phone
     },
     method:'get',
     dataType:'json',
      responseType:'text',
      success:(res)=>{
    var timer=setInterval(function(){
      if(Time >0)
      {
       
        Time--;
        that.setData({
          codebtn:Time + '秒后重新发送',
          disabled:true,
        });
      }
      if(Time ==0)
      {
        that.setData({
          codeText:"发送验证码",
          disabled:false
          });
          clearInterval(timer)
      }
    },1000)
      }
   })
},
logins(e)
{
  console.log(e);
let phone=this.data.phone;
let code=e.detail.value.code;
console.log(code);
if(phone==""){
  wx.showToast({
    title: '手机号不能为空',
    icon:"error"
  })
  return false
}
if(code==""){
  wx.showToast({
    title: '验证码不能为空',
    icon:"error"
  })
  return false
}
wx.request({
  url: 'http://www.blog1.com/index.php/api/getphone',
  data: {
    phone:phone,
    code:code
  },
  header: {'content-type':'application/json'},
  method: 'post',
  dataType: 'json',
  responseType: 'text',
  success:(res)=>{
   console.log(res);
    if(res.data.code == 200)
    {
      wx.setStorageSync('token', res.data.data)
      wx.switchTab({
        url: '../list/list',
      })
      return false
    }
    if(res.data.code ==4001)
    {
      wx.showToast({
        title: '登录未成功',
        icon:"error"
      })
      return false
    }
  }
})
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})