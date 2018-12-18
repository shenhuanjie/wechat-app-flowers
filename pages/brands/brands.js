var app = getApp();
// pages/brands/brands.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchValue: "",
        site: null,
        brandList: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 获取参数
        var site = options.site;
        if (site && site != "undefined") {
            this.setData({
                site: site
            })
            wx.setStorageSync("market", site)
        }
        // 获取列表
        this.getSaleBrand();
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
     * 获取品牌列表
     */
    getSaleBrand: function() {
        var _that = this;
       
        wx.request({
            url: app.globalData.appUrl + '/Product/GetSaleBrand',
            data: {
                // sSite: wx.getStorageSync('market') ? wx.getStorageSync('market') : '缤纷总网'
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data)
                _that.setData({
                    "brandList": res.data
                })
            }
        })
    },
    /**
     * 跳转品牌列表
     */
    toProductList: function(e) {
        var brand = e.currentTarget.dataset.brand;
        wx.setStorage({
            key: "brand",
            data: brand
        });
        wx.navigateTo({
            url: '../../pages/products/products?brand=' + brand,
        })
    }
})