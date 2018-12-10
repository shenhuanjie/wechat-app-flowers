var app = getApp();
// pages/member-info/member-info.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    memcode: null,
    infoList: [{
      id: "",
      title: "注册名称",
      value: "6244"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _that = this;
    wx.getStorage({
      key: 'memcode',
      success: function(res) {
        var memcode = res.data;
        console.log('memcode:' + memcode);
        _that.setData({
          memcode: memcode
        });
        _that.getMemberByCode();
      },
      fail: function(res) {
        _that.onLogout();
      }
    })
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
  /**
   * 用户点击退出登录
   */
  onLogout: function() {
    wx.clearStorage();
    wx.navigateTo({
      url: '../../pages/login/login'
    })
  },
  getMemberByCode: function() {
    var _that = this;
    var memcode = _that.data.memcode;
    wx.request({
      url: app.globalData.appUrl + '/Member/GetMemberByCode',
      data: {
        memcode: memcode
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        var member = res.data.Member;
        if (member && member.Id > 0) {
          var memcode = member.Code;
          var linkman = member.Linkman;
          var tel = member.Phone;
          var weixin = member.Weixin;
          var email = member.Email;
          var area = member.Province + "-" + member.City + "-" + member.Area;
          var detailAddr = member.Maddress;
          var address = member.Deliaddress;
          var business = member.Businessscope;
          var bsType = member.Scopelist;
          _that.setData({
            infoList: [{
              title: "注册名称",
              value: memcode
            }, {
              title: "联系人",
              value: linkman
            }, {
              title: "手机",
              value: tel
            }, {
              title: "微信",
              value: weixin
            }, {
              title: "电子邮箱",
              value: email
            }, {
              title: "所在地区",
              value: area
            }, {
              title: "详细地址",
              value: detailAddr
            }, {
              title: "收货地址",
              value: address
            }, {
              title: "经营范围",
              value: business
            }, {
              title: "营业性质",
              value: bsType
            }]
          })
        } else {
          _that.onLogout();
        }
      }
    })
  }
})