// pages/test/test.js
let QQMapWX = require('../../utils/qqmap-wx-jssdk');
var qqmapsdk = new QQMapWX({
  key: 'QJ5BZ-IEYC3-P4U3I-YIYQ2-BZ3H3-7JBWC' // 必填
});
Page({
  /**
   * 获取当前位置
   */
  getAddress() {
    wx.chooseLocation({
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
          covers: [{
            id: 2,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 20,
            height: 30,
          }]
        })
      }
    })
  },
  /**
  * 拨号
  */
  call() {
    wx.makePhoneCall({
      phoneNumber: '18001743418',
    })
  },

  /**
  * 选择出行方式
  */
  // go(e) {
  //   console.log(e);
  //   this.setData({
  //     go: e.detail.currentKey
  //   })
  // },
  /**
   * 页面的初始数据
   */
  data: {
    latitude: "",
    longitude: "",
    covers: "",
    scale: 16,
    polyline: [{
      points: [],
      color: "#3FB837",
      width: 3,
      dottedLine: false
    }],
    go: "",
    distance: "",
    properties:''
  },

  place(e) {
    let _this = this;
    let go = _this.data.go;
    // if (go == '') {
    //   wx.showToast({
    //     title: '请先选择出行方式',
    //     icon: "none"
    //   })
    //   return;
    // }
    let to = [{
      latitude: e.detail.latitude,
      longitude: e.detail.longitude
    }];
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: _this.data.latitude + ',' + _this.data.longitude,
      to: e.detail.latitude + ',' + e.detail.longitude,
      success: function (res) {
        console.log(res);
        let coors = res.result.routes[0].polyline;
        for (let i = 2; i < coors.length; i++) {
          coors[i] = coors[i - 2] + coors[i] / 1000000
        }
        let coors_new = []
        for (let j = 0; j < coors.length; j++) {
          coors_new.push({
            latitude: parseFloat(coors[j]),
            longitude: parseFloat(coors[j + 1])
          })
          j++;
        }
        //获取距离
        qqmapsdk.calculateDistance({
          from: _this.data.latitude + ',' + _this.data.longitude,
          to: to,
          success: res => {
            // console.log(res);
            // console.log(res.result.elements[0].distance);
            _this.setData({
              distance: res.result.elements[0].distance
            })
          }
        })
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          polyline: [{
            points: coors_new,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          covers: [{
            id: 1,
            latitude: res.latitude,
            longitude: res.longitude,
            width: 20,
            height: 30,
          }]
        })
      }
    })
  },
})