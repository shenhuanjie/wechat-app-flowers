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

        popDisplay: "none",


        recommendList: [],
        addressList: []
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
    getRecommendList: function() {
        var _that = this;
        wx.request({
            url: app.globalData.appUrl + '/Product/GetRecommendList',
            data: {
                page: 1,
                pageSize: 4,
                orderUser: wx.getStorageSync("memcode") ? wx.getStorageSync("memcode") : ""
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data)
                _that.setData({
                    recommendList: res.data.Rows,
                    addressList: res.data.AddressList
                })
                wx.hideLoading();
            }
        })
    },
    onPopDisplay: function() {
        var popDisplay = "block";
        if (this.data.popDisplay != "none") {
            popDisplay = "none"
        }
        this.setData({
            popDisplay: popDisplay
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
    toAddressAdd: function() {
        wx.navigateTo({
            url: '../../pages/address-add/address-add'
        })
    },

    /**
     * 跳转品牌列表
     */
    toBrands: function(e) {
        this.setData({
            popDisplay: "none"
        });
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
        var id = even.currentTarget.dataset.id;
        console.log(id);
        wx.navigateTo({
            url: '../../pages/product/product?id=' + id,
        })
    },
})