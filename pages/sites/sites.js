var app = getApp();
// pages/sites/sites.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue: "",
        saleSite: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getSaleSite();
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
     * 跳转品牌列表
     */
    toBrands: function(e) {
        var site = e.currentTarget.dataset.site;
        wx.setStorageSync('market', site);
        wx.navigateTo({
            url: '../../pages/brands/brands?site=' + site,
        })
    }
})