var app = getApp();
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgCode: "",
    guid: "",
    username: "",
    password: "",
    validCode: "",
    savePassword: false,
    items: [{
      name: 'savePwd',
      value: '记住密码'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.toChangeImg();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  bindUserName: function(event) {
    this.setData({
      username: event.detail.value
    });
  },
  bindPassword: function(event) {
    this.setData({
      password: event.detail.value
    });
  },
  bindValidCode: function(event) {
    this.setData({
      validCode: event.detail.value
    });
  },
  checkboxChange: function(e) {
    if (e.detail.value == "") {
      this.setData({
        savePassword: false
      })
    } else {
      this.setData({
        savePassword: true
      })
    }
  },
  /**
   * 用户点击登录按钮
   */
  onLogin: function() {
    var _that = this;
    var username = this.data.username;
    var userpassword = this.data.password;
    var validCode = this.data.validCode;
    var guid = this.data.guid;

    var checkFlat = true;
    var errorMsg = "";
    if (username == "") {
      errorMsg = "请输入你的用户名";
      checkFlat = false;
    } else if (checkFlat && userpassword == "") {
      errorMsg = "请输入你的密码";
      checkFlat = false;
    } else if (checkFlat && validCode == "") {
      errorMsg = "请输入验证码";
      checkFlat = false;
    }
    if (!checkFlat) {
      wx.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      })
      return false;
    }

    wx.request({
      url: app.globalData.appUrl + '/Member/Userlogin',
      data: {
        Memcode: username,
        Pwd: userpassword,
        guid: guid,
        validCode: validCode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        var data = res.data;
        console.log(data);
        var msg = data.Msg;
        if (data.Success) {
          wx.setStorage({
            key: "memcode",
            data: username
          });

          var member = data.Rows[0];
          wx.setStorage({
            key: "memName",
            data: member.Name
          });
          wx.showToast({
            title: "登录成功",
            icon: 'none',
            duration: 2000
          });
          setTimeout(function() {
            _that.toIndex();
          }, 1000);
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
          })
          _that.toChangeImg();
        }
      }
    })
  },

  /**
   * 跳转平台首页
   */
  toIndex() {
    console.log("onLogin");
    wx.switchTab({
      url: '../../pages/setting/setting',
      success(res) {
        let page = getCurrentPages().pop()
        if (page == undefined || page == null) {
          return
        }
        page.onLoad()
      }
    })
  },

  /**
   * 跳转注册页面
   */
  toRegister: function() {
    wx.navigateTo({
      url: '../../pages/register/register',
    })
  },

  /**
   * 刷新验证码
   */
  toChangeImg: function() {
    var _that = this;
    var _uuid = app.uuid();
    _that.setData({
      "imgCode": app.globalData.appUrl + "/RandomCode/GetRandomCode?guid=" + _uuid,
      "guid": _uuid
    })
  }
})