//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    categroy: [],
    touxiang: app.globalData.url,
    list: [],
    loadingHidden: true,
    is_repeat: true,
    page: 1,
    tj: 1,
    comment:[],
    gg:[]
  },
  onLoad: function (options) {
    //登录状态监测
    //获取文章id
    var that = this;
    that.setData({
      videoid: options.videoid
    })

    /**
     * 第一次进入还是返回首页初始化is_repeat
     */
    this.data.is_repeat = true;
    var that = this;

    //获取全部视频信息
    var inurl = app.globalData.url + "m/wechat_api.php?rec=action&videoid=" + options.videoid + "&username=" + app.globalData.userid;
    console.log(inurl);
    this.http(inurl, 10, this.callback);
    //获取评论
    var comment = app.globalData.url + "m/wechat_api.php?rec=get_pl&id=" + options.videoid+"&page=1";
    wx.request({
      url: comment,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          comment : res.data
        })
      }
    })

      //加载广告
    wx.request({
      url: "https://183545.com/m/wechat_api.php?rec=gg",
      data: {},
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        that.setData({
          gg: res.data
        })
      }
    })



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
  
  detailfunc: function (e) {
    //暂停所有视频
    var videoContextPrev = wx.createVideoContext(['index', this.data.playIndex].join(''));
    videoContextPrev.seek(0)
    videoContextPrev.pause()
    this.setData({
      playIndex: -1,
      loadingHidden: false
    })


    this.data.page = 1;
    //e.target.dataset.id当前栏目视频
    var catid = e.target.dataset.id;
    this.data.catid = catid;
    var categroyurl = app.globalData.url + "m/wechat_api.php?rec=category&page=" + this.data.page + "&num=8&username=" + app.globalData.userid+"&id=" + catid;
    this.data.page = this.data.page + 1;
    var that = this;
    var res_lst = [];
    wx.request({
      url: categroyurl,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (e) {
        var res = e.data;
        console.log('index切换栏目');
        console.log(e.data);
        for (var i in res) {
          res_lst.push(res[i]);
        }
        that.setData({
          list: res_lst,
          catid: catid,
          tj: 2,
          loadingHidden: true
        })


      }
    })

  },
  onShow: function (options) {
   
    //tabbar切换刷新
    


  },
  nihao: function (e) {
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
        }
      }
    })

    //动态设置改变xml的状态
    var that = this;
    that.setData({
      [is_gu]: is_gz
    });


  },
  formSubmit: function (e) {
    var comment = e.detail.value.comment;
    var id = this.data.videoid;
    var username = app.globalData.userid;

    var comurl = app.globalData.url + "m/wechat_api.php?rec=pltj&id=" + id;
    wx.request({
      url: comurl,
      data: {
        username:username,
        content: comment
      },
      method: "POST",
      header: {
        'content-type': "application/x-www-form-urlencoded" // 默认值
      },
      success: function (e) {
        if(e.data == 1){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
        }
        if (e.data == 2) {
          wx.showToast({
            title: '内容不可为空',
            icon: 'none',
            duration: 2000
          })
        }
        if (e.data == 0) {
          wx.showToast({
            title: '先登录',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },
  onShareAppMessage: function () {
    var tit = '麦兜视频';
    var path = '/pages/action/action??videoid=' + videoid;
    return {
      title: tit,
      path: path
    }
  }
})
