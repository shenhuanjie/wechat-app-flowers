// const product = require('../../interface/product.js')

var app = getApp();
Page({
  data: {
    imgPrefix: app.globalData.imgPrefix,
    advertList: {},
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    saleSite: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getAdvertList();
    this.getSaleSite();
  },
  getAdvertList: function() {
    var _that = this;
    wx.request({
      url: app.globalData.appUrl + '/Advert/GetAdvertList',
      data: {
        adType: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        _that.setData({
          "advertList": res.data
        })
      }
    })
  },
  getSaleSite: function() {
    var _that = this;
    wx.request({
      url: app.globalData.appUrl + '/Product/GetSaleSite',
      data: {
        adType: '1'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        _that.setData({
          "saleSite": res.data
        })
      }
    })
  },
  /**
   * 跳转站点列表页面
   */
  toSiteList: function() {
    wx.navigateTo({
      url: '../../pages/sites/sites'
    })
  },

  /**
   * 跳转品牌列表
   */
  toBrands: function(e) {
    var _site = e.currentTarget.dataset.site;
    wx.navigateTo({
      url: '../../pages/brands/brands?site=' + _site,
    })
  }
})