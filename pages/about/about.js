//定义一个全局变量，调用app.js里面的name
var app = getApp();


//获取应用实例
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: app.globalData.logininfo,
    logo: 1,

    but: 1

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
    console.log('进入about');
    var that = this;
    that.setData({
      canIUse: app.globalData.canIUse,
      logininfo: app.globalData.logininfo
    })
    console.log('退出about');

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

  },
  bindGetUserInfo: function (e) {

    var that = this
    wx.login({
      success: function (res) {
        var code = res.code
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称

              wx.getUserInfo({
                success: function (res) {
                  //微信用户头像
                  that.setData({
                    logo: res.userInfo.avatarUrl,
                    name: res.userInfo.nickName,
                  })
                  // that.globalData.userInfo = res.userInfo                
                  var rawData = res.rawData;
                  var signature = res.signature;
                  var encryptedData = res.encryptedData;
                  var iv = res.iv;
                  //登录动画
                  wx.showLoading({
                    title: '登录中...',
                  })

                  wx.request({
                    url: app.globalData.url + "m/wechat_api.php?rec=wechat_code",
                    data: {
                      "code": code,
                      "rawData": rawData,
                      "signature": signature,
                      "iv": iv,
                      "encryptedData": encryptedData
                    },
                    method: 'GET',
                    success: function (res) {
                      // success  
                      that.setData({
                        openid: res.data.openid
                      })
                      console.log(res.data);
                      //返回openid  session_key
                      //获取到的3rd_session保存在本地
                      wx.setStorageSync('3rd_session', res.data);
                      //发送查询
                      wx.request({
                        url: app.globalData.url + "m/wechat_api.php?rec=getsession",
                        data: {
                          "rd3_session": res.data
                        },
                        method: 'GET',
                        success: function (res) {
                          if (!res.data) {
                            console.log('登陆后失效了');
     
                          } else {
                            console.log('登录后没有失效');
                            app.globalData.userid = res.data.user_name;
                            app.globalData.logininfo = res.data;
                            app.globalData.canIUse = 0;
                            //刷新当前登录状态
                            that.onShow();
                            //动画结束
                            setTimeout(function () {
                              wx.hideLoading()      
                            }, 100)
                          }
                        }
                      })
                      //查询结束


                    }
                  })
                }
              })
            } else {
              console.log('用户不给授权');
              wx.showLoading({
                title: '授权失败,返回首页',
              })
              setTimeout(function () {
                wx.hideLoading()
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }, 1000)

            }
          }
        })





      }
    })
  },
  getres: function (){
    console.log('登录后调用了');
    
    
  },
  myjifen:function(e){
    wx.navigateTo({
      url: '/pages/jifen/jifen'
    })
  },
  myfensi: function (e) {
    wx.navigateTo({
      url: '/pages/fensi/fensi'
    })
  }

})
    

    
  