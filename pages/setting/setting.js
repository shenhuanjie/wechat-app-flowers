// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    login: "登录",
    account: {
      userName: "请登录",
      balance: 0
    },
    list: [{
      id: 'view',
      name: '视图容器',
      open: false,
      pages: [{
        id: 'view',
        name: '订单查询'
      }, {
        id: 'view',
        name: '账单查询'
      }, {
        id: 'view',
        name: '发货查询'
      }, {
        id: 'password-revise',
        name: '修改密码'
      }, {
        id: 'complaint',
        name: '投诉建议'
      }, {
        id: 'comments',
        name: '提交留言'
      }, {
        id: 'logistics',
        name: '物流信息'
      }, {
        id: 'view',
        name: '最新信息'
      }]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _that = this;
    wx.getStorage({
      key: 'memName',
      success(res) {
        console.log(res.data);
        _that.setData({
          account: {
            userName: res.data,
            balance: 0
          },
          login: "退出登录"
        })
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
  }
})