var app = getApp();
// 引入腾讯位置服务SDK核心类
var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;
// pages/brands/brands.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        searchValue: "",
        site: null,
        city: '',
        address: '',
        brandList: [],
        filterList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: app.globalData.MapsKey
        });
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
        var that = this;
        var latitude = 39.984060;
        var longitude = 116.307520;
        //获取当前位置
        wx.getLocation({
            success: function(res) {
                console.log(res);
                latitude = res.latitude;
                longitude = res.longitude;
                // 调用接口
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    success: function(res) {
                        console.log(res);
                        console.log("当前位置：" + res.result.address);
                        console.log("当前城市：" + res.result.ad_info.city);
                        that.setData({
                            city: res.result.ad_info.city,
                            address: res.result.address,
                        })
                    },
                    fail: function(res) {
                        console.log(res);
                    },
                    complete: function(res) {
                        // console.log(res);
                    }
                });
            }
        })
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
    showToast: function() {
        var that=this;
        wx.showToast({
            title: "当前位置："+that.data.address,
            icon: 'none'
        })
    },
    /**
     * 获取品牌列表
     */
    getSaleBrand: function() {
        var _that = this;
        app.showLoading();
        wx.request({
            url: app.globalData.appUrl + '/Product/GetSaleBrand',
            data: {
                // sSite: wx.getStorageSync('market') ? wx.getStorageSync('market') : '缤纷总网'
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data.Rows)
                wx.hideLoading();
                _that.setData({
                    "brandList": res.data.Rows,
                    "filterList": res.data.Rows,
                    "searchValue": "",
                })
            }
        })
    },
    /**
     * 输入监听
     */
    changeSearch: function(even) {
        console.log(even);
        var value = even.detail.value;
        this.setData({
            searchValue: value,
        })
        this.doSearch();
    },
    /**
     * 搜索列表
     */
    doSearch: function() {
        var kw = this.data.searchValue;
        var brandList = this.data.brandList;
        var filterList = [];
        console.log(brandList);
        for (var i = 0; i < brandList.length; i++) {
            var item = brandList[i];
            var brand = item.Brand;
            if (brand.indexOf(kw) != -1) {
                filterList.push(item);
            }
        }
        this.setData({
            filterList: filterList
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