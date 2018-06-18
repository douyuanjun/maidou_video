// pages/fensi/fensi.js
//定义一个全局变量，调用app.js里面的name
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: app.globalData.logininfo,
    logo: 1,
    but: 1,
    list:[]
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      canIUse: app.globalData.canIUse,
      logininfo: app.globalData.logininfo
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
    var that = this;
    var category = app.globalData.url + "m/wechat_api.php?rec=wechat&user_name=" + app.globalData.userid;
    console.log(category);
    wx.request({
      url: category,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          list: res.data
        })
      }
    })
  
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