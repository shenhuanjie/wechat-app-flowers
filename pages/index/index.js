Page({
  data: {
    imgUrls: [
      '/resource/images/img_swiper_01.png',
      '/resource/images/img_swiper_01.png',
      '/resource/images/img_swiper_01.png',
      '/resource/images/img_swiper_01.png',
      '/resource/images/img_swiper_01.png'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  /**
   * 跳转站点列表页面
   */
  toSiteList: function () {
    wx.navigateTo({
      url: '../../pages/sites/sites'
    })
  }
})