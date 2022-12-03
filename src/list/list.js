Page({
  data: {
      list:[],
      page:1,
      last_page:""
  },
  onLoad: function (options) {
    let token=wx.getStorageSync('token');
    if(!token)
    {
      wx.navigateTo({
        url: '../phone/phone',
      })
    }
      let that = this;
         wx.request({
           url: 'http://www.blog1.com/index.php/api/list',
           data:{
               pageSize :5,//每页查询条数
           },
           success:(res)=>{
             console.log(res.data.data.data);
             that.setData({
              list:res.data.data.data,
              last_page:res.data.data.last_page,//获取最后一页的页码数存起来
             })
           }
         })
    },
   click(e)
   {
      console.log(e);
      let id=e.target.dataset.id;
      wx.navigateTo({
        url: '../detail/detail?id='+id,
      })
   },
    //瀑布流分页 上拉
    onReachBottom: function (e) {
      let _this = this;
      let page = _this.data.page+1;//获取下一页
          wx.showLoading({//温馨提示正在加载第几页
            title: '正在加载第'+page+"页",
          })
          if(page>_this.data.last_page)
          {//判断是否到最后一页
            wx.showToast({
             //友情提示
              title: '到底了',
              icon:'error'
            })
          }
         
      //设置定时器 过滤加载时间
      setTimeout(function(){
        wx.request({
          url: 'http://www.blog1.com/index.php/api/list',
          data:{
            page:page,//页码
            pageSize:5//一次查询几条
          },
          success(res){
            _this.setData({
                page:_this.data.page+1,//页码加一
                list:_this.data.list.concat(res.data.data.data)//两个数组合并
            })
          }
        })
        wx.hideLoading();//清除正在加载的时间
      },1000)
    },
})