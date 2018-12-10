//app.js
App({
  onLaunch: function() {},
  /**
   * 用户点击退出登录
   */
  onLogout: function() {
    wx.clearStorage();
    wx.navigateTo({
      url: '../../pages/login/login'
    })
  },
  uuid: function() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
  },
  globalData: {
    userInfo: null,
    // API_URL
    appUrl: "http://120.77.233.160:8965",
    // QINIU_PREFIX
    qiniuPrefix: "http://complaint.brightenflower.cn/",
    // 大图前缀
    imgPrefix: "http://www.brightenflower.cn/PicPath/",
    // 缩略图前缀
    thumbnailsPrefix: "http://www.brightenflower.cn/PicPath/img/"
  }
})