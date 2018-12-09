var app = getApp();
// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgCode: "",
    guid: "",
    username: "",
    password: "",
    confirmPassword: "",
    linkman: "",
    phone: "",
    validCode: "",
    readAndAgree: false,
    items: [{
      name: 'readAndAgree',
      value: '阅读并接受《会员协议》'
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
  bindConfirmPassword: function(event) {
    this.setData({
      confirmPassword: event.detail.value
    });
  },
  bindLinkman: function(event) {
    this.setData({
      linkman: event.detail.value
    });
  },
  bindPhone: function(event) {
    this.setData({
      phone: event.detail.value
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
        readAndAgree: false
      })
    } else {
      this.setData({
        readAndAgree: true
      })
    }
  },
  onRegister: function() {
    var _that = this;
    var guid = this.data.guid;

    var username = this.data.username;
    var password = this.data.password;
    var confirmPassword = this.data.confirmPassword;
    var linkman = this.data.linkman;
    var phone = this.data.phone;
    var validCode = this.data.validCode;
    var readAndAgree = this.data.readAndAgree;

    var checkFlat = true;
    var errorMsg = "";

    if (username == "") {
      errorMsg = "请输入你的用户名";
      checkFlat = false;
    } else if (checkFlat && password == "") {
      errorMsg = "请输入你的密码";
      checkFlat = false;
    } else if (checkFlat && confirmPassword == "") {
      errorMsg = "请输入确认密码";
      checkFlat = false;
    } else if (checkFlat && password != confirmPassword) {
      errorMsg = "两次密码不一致，请重新输入";
      checkFlat = false;
    } else if (checkFlat && linkman == "") {
      errorMsg = "请填写联系人";
      checkFlat = false;
    } else if (checkFlat && phone == "") {
      errorMsg = "请输入你的手机号";
      checkFlat = false;
    } else if (checkFlat && validCode == "") {
      errorMsg = "请输入验证码";
      checkFlat = false;
    } else if (checkFlat && !readAndAgree) {
      errorMsg = "请阅读并同意协议";
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
    // 验证通过
    wx.request({
      url: app.globalData.appUrl + '/Member/Reg',
      data: {
        name: username,
        pwd: password,
        phone: phone,
        linkman: linkman,
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
          wx.showToast({
            title: "注册成功，请耐心等待审核，审核过程中将会有客服联系您",
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
      url: '../../pages/index/index',
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