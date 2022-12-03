// pages/form/form.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
url:[],
address:""
  },
  onChangeTap(e)
  {
     let that=this;
     let path=e.detail.all;
 
     for(let i=0; i<path.length; i++)
     {
       wx.uploadFile({
         filePath: path[i],
         name: 'image',
         url: 'http://www.blog1.com/index.php/api/image',
         success(res)
         {
           let data=JSON.parse(res.data);
           if(data.code ==200 )
           {
              var src=data.data
              var url=that.data.url
              console.log(src);
              url =url.concat(src);
             that.setData({
               url:url
             })
              console.log(url);
           }
         }
       })
     }
  },
  address()
{
  wx.chooseLocation({
    latitude: 0,
    success:(res)=>{
    let address=res.address
    this.setData({
    address:address
    })
    }
  })
},
  form(e)
  {
    let title=e.detail.value.title;
    let token=wx.getStorageSync('token');
    console.log(token);
    let img=this.data.url;
    wx.request({
      url: 'http://www.blog1.com/index.php/api/form',
      data:{
        token:token,
        title:title,
        image:img
      },
      method:'post',
      dataType:'json',
      responseType:'text',
      success:(res)=>{
        if(res.data.coed  ==200 ){
          wx.switchTab({
            url: '../list/list',
          })
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