//follow.js
//获取应用实例
const app = getApp()
Page({
  data: {
    gzuser: [],   
    url: app.globalData.url,
    touxiang: app.globalData.url,
    list: [],
    loadingHidden: true,
    is_repeat: true,
    page: 1,
    tj: 1
  },
  onLoad: function (options) {
    
  },
  authorlst_click:function(e){
    wx.showLoading({
      title: '加载中',
    })
    this.data.list = [];
    //获取作者列表
    //作者id = e.currentTarget.dataset.id;
    this.data.authorid = e.currentTarget.dataset.id;
    //获取全部视频信息
    var inurl = app.globalData.url + "m/wechat_api.php?rec=gzz&page=" + this.data.page + "&username=" + this.data.authorid;
    this.data.page = this.data.page+1;
    this.http(inurl, 10, this.callback);
    setTimeout(function () {
      wx.hideLoading()
    }, 500)

  },
  http: function (category, count, callback) {
    wx.request({
      url: category,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        callback(res.data)
      }
    })
  },
  callback: function (res) {
    //数据处理
    var res_lst = [];
    var two_res = [];
    if (!this.data.is_repeat) {

      for (var i in res) {
        two_res.push(res[i]);
      }
      res_lst = this.data.list.concat(two_res);
    } else {
      for (var i in res) {
        res_lst.push(res[i]);
      }

      this.data.is_repeat = false
    }

    console.log(res_lst);
    this.setData({
      list: res_lst

    })

  },
  // 点击cover播放，其它视频结束
  videoPlay: function (e) {

    var length = this.data.list.length
    var id = e.currentTarget.id//播放中的id
    if (!this.data.playIndex) { // 没有播放时播放视频
      this.setData({
        playIndex: id
      })
      var videoContext = wx.createVideoContext(['index', id].join(''))
      videoContext.play()
    } else {                    // 有播放时先将prev暂停到0s，再播放当前点击的current
      var videoContextPrev = wx.createVideoContext(['index', this.data.playIndex].join(''))
      videoContextPrev.seek(0)
      videoContextPrev.pause()
      this.setData({
        playIndex: id
      })
      var videoContextCurrent = wx.createVideoContext(['index', this.data.playIndex].join(''))
      videoContextCurrent.play()
    }
  },
  onReachBottom: function () {
    //触底加载函数
    if (!this.data.authorid) {

      //首页下一页
      var that = this;
      that.setData({
        loadingHidden: false
      })
      var inurl = app.globalData.url + "m/wechat_api.php?rec=index&page=1&num=8&username=" + app.globalData.userid;
      this.http(inurl, 10, this.callback);
      that.setData({
        loadingHidden: true
      })

    } else {
      //列表页下一页

      var that = this;
      that.setData({
        loadingHidden: false
      })
      var inurl = app.globalData.url + "m/wechat_api.php?rec=gzz&page=" + that.data.page + "&username=" + that.data.authorid;
      this.data.page = this.data.page + 1;
      this.http(inurl, 10, this.callback);
      that.setData({
        loadingHidden: true
      })
    }

  },
  //上拉刷新
  onPullDownRefresh: function () {
    //主页刷新
    if (!this.data.catid) {
      this.data.is_repeat = true;
      var inurl = app.globalData.url + "m/wechat_api.php?rec=index&page=1&num=8&username=" + app.globalData.userid;
      this.http(inurl, 10, this.callback);
      wx.stopPullDownRefresh();
    } else {
      //列表刷新不随机
      wx.stopPullDownRefresh();
    }

  },
  nihao: function (e) {
    var that = this;
    var i = e.target.dataset.i;
    var s = e.target.dataset.is;
    var authorid = e.target.dataset.authorid;
    var is_gu = "list[" + i + "].is_gz";
    //如果关注了就取消关注
    var is_gz = 0;
    if (s != 1) {
      is_gz = 1;
    }

    //请求服务器+关注
    /**
     * 传入要关注作者id
     * 传入session当前用户
     */
    var gz_api = app.globalData.url + "m/author.php?status=" + is_gz + "&username=" + app.globalData.userid+"&authorid=" + authorid;
    console.log(gz_api);
    wx.request({
      url: gz_api,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (e) {
        if (e.data == 1) {
          wx.showToast({
            title: '不可重复操作',
            icon: 'waiting',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
          that.onShow();
        }
      }
    })

    //动态设置改变xml的状态
    var that = this;
    that.setData({
      [is_gu]: is_gz
    });


  },
  onShow: function () {
    var that = this;
    that.setData({
      list: []
    })
    if (app.globalData.userid == 0) {
      wx.showLoading({
        title: '先登录',
      })

      setTimeout(function () {
        wx.hideLoading()
        wx.switchTab({
          url: '/pages/about/about'
        })
      }, 1000)
    }else{
      var url = app.globalData.url + "m/wechat_api.php?rec=gzusers&username=" + app.globalData.userid;
      console.log(url);
      wx.request({
        url: url,
        data: {},
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res);
          that.setData({
            gzuser: res.data
          })
        }
      })
    }
    
    

  }


})