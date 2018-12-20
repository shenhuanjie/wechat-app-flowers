// const product = require('../../interface/product.js')

var app = getApp();
Page({
    data: {
        imgPrefix: app.globalData.imgPrefix,
        imgMode: "",
        advertList: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        saleSite: [{
            Ssite: '缤纷总网',
            Module: '鲜花'
        }, {
            Ssite: '缤纷总网',
            Module: '盆栽'
        }, {
            Ssite: '缤纷总网',
            Module: '花艺'
        }],
        recommendList: []
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        app.showLoading();
        this.getAdvertList();
        // this.getSaleSite();
        this.getRecommendList();
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
                    "advertList": res.data.Rows
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
                    "saleSite": res.data.Rows
                })
            }
        })
    },
    getRecommendList: function() {
        var _that = this;
        wx.request({
            url: app.globalData.appUrl + '/Product/GetRecommendList',
            data: {
                page: 1,
                pageSize: 4
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data)
                _that.setData({
                    "recommendList": res.data.Rows
                })
                wx.hideLoading();
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
    },
    /**
     * 跳转商品详情
     */
    toProduct: function(even) {
        console.log(even);
        var productId = even.currentTarget.dataset.id;
        console.log(productId);
        wx.navigateTo({
            url: '../../pages/product/product?productId=' + productId,
        })
    },
})