// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
ping:[],
id:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id=options.id;
    this.setData({
      id:id
    })
     wx.request({
       url: 'http://www.blog1.com/index.php/api/detail',
       data:{
       id:id
       },
       method:"get",
       dataType:"json",
       responseType:"text",
       success:(res)=>{
          console.log(res);
          this.setData({
            goods:res.data.data,
            ping:res.data.data.comment
          })
       }
     })
  },
  form(e)
  {
    console.log(e);
     let token=wx.getStorageSync('token');
     let comment=e.detail.value.comment;
     let id=this.data.id
     wx.request({
       url: 'http://www.blog1.com/index.php/api/comment',
       data:{
          token:token,
          comment:comment,
           text_id:id
       },
       method:'post',
       dataType:'json',
       responseType:'text',
        success:(res)=>{
         if(res.data.code == 200)
         {
           wx.showToast({
             title: '发布成功',
           })
         }
        }
     })
  },
  report(e)
  {
     console.log(e);
     let that=this;
     let id=e.target.dataset.id;
     let text_id=that.data.id;
    //  console.log(text_id);
     let token=wx.getStorageSync('token')
     wx.showModal({
       title:'请输入评论',
       editable:true,
       success(res)
       {
let comment=res.content
    wx.request({
      url: 'http://www.blog1.com/index.php/api/report',
      data:{
        token:token,
        pid:id,
        text_id:text_id,
        comment:comment
      },
      header: {'content-type':'application/json'},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success:(res)=>{
        console.log(res);
        if(res.data.code == 200)
        {
          wx.showToast({
            title: '发布成功',
          })
        }
      // console.log(res);
      // this.setData({
      //   ping:res.data.data
      // })
      }
    })
       }

     })
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