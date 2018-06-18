//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    categroy:[],
    touxiang: app.globalData.url,
    list: [],
    loadingHidden: true,
    is_repeat:true,
    page:1,
    tj:1
  },
  onLoad: function (options) { 
    //登录状态监测



   


    

  },
  http:function(category,count,callback){
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
  callback:function(res){
    //数据处理
    var res_lst = [];
    var two_res = [];
    if (!this.data.is_repeat){
      
      for (var i in res) {
        two_res.push(res[i]);
      }
      res_lst = this.data.list.concat(two_res);
    }else{
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
    if (!this.data.catid) {
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

    }else{
      //列表页下一页
      var that = this;
      that.setData({
        loadingHidden: false
      })
      var inurl = app.globalData.url + "m/wechat_api.php?rec=category&page=" + this.data.page + "&num=8&username=" + app.globalData.userid+"&id=" + this.data.catid;
      this.data.page = this.data.page+1;
      this.http(inurl, 10, this.callback);
      that.setData({
        loadingHidden: true
      })
    }
    
  },
  //上拉刷新
  onPullDownRefresh: function () {
    //主页刷新
    if (!this.data.catid){
      this.data.is_repeat = true;
      var inurl = app.globalData.url + "m/wechat_api.php?rec=index&page=1&num=8&username=" + app.globalData.userid;
      this.http(inurl, 10, this.callback);
      wx.stopPullDownRefresh();
    }else{
      //列表刷新不随机
      wx.stopPullDownRefresh();
    }

  },
  detailfunc: function (e) {
    //暂停所有视频
    var videoContextPrev = wx.createVideoContext(['index', this.data.playIndex].join(''));
    videoContextPrev.seek(0)
    videoContextPrev.pause()
    this.setData({
      playIndex: -1,
      loadingHidden : false
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
          tj:2,
          loadingHidden: true
        })

        
      }
    })

  },
  onShow:function(){
    // app.js执行
    var that = this;
    wx.checkSession({
      success: function (res) {
        console.log("登录态没失效");
        //获取用户3rd_session
        var rd3_session = wx.getStorageSync('3rd_session');
        wx.request({
          url: "https://183545.com/m/wechat_api.php?rec=getsession",
          data: {
            "rd3_session": rd3_session
          },
          method: 'GET',
          success: function (res) {
            if (!res.data) {
              console.log('本地缓存已经失效');
              app.globalData.canIUse = 1;
              that.jz_index();
              //console.log(that.globalData.canIUse);
            } else {
              console.log('本地缓存没有失效,不需要重新登录');
              app.globalData.logininfo = res.data;
              app.globalData.userid = res.data.user_name;
              console.log(app.globalData.userid);
              that.jz_index();
            }
          }
        })
      },
      fail: function (res) {
        console.log("需要重新登录");
        app.globalData.canIUse = 1;
        that.jz_index();

      }
    })
    // app.js执行end
    //tabbar切换刷新
    /**
     * 第一次进入还是返回首页初始化is_repeat
     */
    this.data.is_repeat = true;
    var that = this;

    //获取的栏目id  options.catid
    //获取栏目名称+id
    var categroyurl = app.globalData.url + "m/wechat_api.php?rec=categroy";
    wx.request({
      url: categroyurl,
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (e) {
        that.setData({
          categroy: e.data,
          catid: 0,
          tj: 1
        })
      }
    })

    
    

  },
  jz_index:function(){
    //获取全部视频信息
    if (app.globalData.userid != 0){
      var inurl = app.globalData.url + "m/wechat_api.php?rec=index&page=1&num=8&username=" + app.globalData.userid;
      this.http(inurl, 10, this.callback);
    }else{
      var inurl = app.globalData.url + "m/wechat_api.php?rec=index&page=1&num=8";
      this.http(inurl, 10, this.callback);
    }
    
  },
  nihao:function(e){
    if (app.globalData.userid == 0) {
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        duration: 2000
      })
    }else{
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
    }


    
  },
  actionclick:function(e){
    
    // 跳转内容页
    wx.navigateTo({
      url: '/pages/action/action?videoid=' + e.currentTarget.dataset.videoid
    })
  },
  onShareAppMessage: function () {
    var tit = '麦兜视频';
    var path = '/pages/index/index';
    return {
      title: tit,
      path: path
    }
  }
})
