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
        memCode: "",
        searchValue: "",
        latitude: "39.984060",
        longitude: "116.307520",
        province: '广东省',
        city: '广州市',
        district: '天河区',
        address: '',
        brand: [],
        brandList: [],
        brandAllList: [],
        filterList: [],

        locationShow: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        // 实例化API核心类
        qqmapsdk = new QQMapWX({
            key: app.globalData.MapsKey
        });
        var memCode = wx.getStorageSync("memcode");

        this.setData({
            memCode: memCode
        })
        //登录验证
        if (!app.checkLogin()) {
            return false;
        }
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        var that = this;
        // 获取列表
        var site = that.data.site;
        wx.setStorageSync("market", site);
        this.getLocation();
    },
    /**
     * 显示位置信息
     */
    showLocation: function() {
        console.log("showLocation");
        var that = this;
        that.setData({
            locationShow: !this.data.locationShow
        });
    },
    /**
     * 切换位置信息
     */
    switchLocation: function(e) {
        console.log("switchLocation");
        var item = e.currentTarget.dataset.brand;
        var that = this;
        wx.showToast({
            title: "当前位置：" + item.Province + item.City + item.Area,
            icon: 'none'
        });

        that.setData({
            province: item.Province,
            city: item.City,
            district: item.Area,
            address: item.Province + item.City + item.Area,
        })

        // 获取列表
        that.getSaleBrand();

        that.showLocation();
    },
    /**
     * 获取用户当前位置
     */
    getLocation: function() {
        var that = this;
        var latitude = that.data.latitude;
        var longitude = that.data.longitude;
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
                            province: res.result.ad_info.province,
                            city: res.result.ad_info.city,
                            district: res.result.ad_info.district,
                            address: res.result.address,
                        })
                    },
                    fail: function(res) {
                        console.log(res);
                    },
                    complete: function(res) {
                        // 获取列表
                        that.getSaleBrand();
                    }
                });
            }
        })
    },
    /**
     * 获取品牌列表
     */
    getSaleBrand: function() {
        console.log("getSaleBrand");
        var _that = this;
        var memCode = this.data.memCode;
        var province = this.data.province;
        var city = this.data.city;
        var district = this.data.district;
        app.showLoading();
        wx.request({
            url: app.globalData.appUrl + '/Product/GetSaleBrand',
            data: {
                Province: province ? province : '广东省',
                City: city ? city : '广州市',
                Area: district ? district : '天河区',
                memCode: memCode
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var brandList = res.data.Rows;
                var brandAllList = res.data.AllRows;
                if (_that.data.brandAllList != null && _that.data.brandAllList.length > 0) {
                    brandAllList = _that.data.brandAllList;
                }
                console.log(res.data);
                wx.hideLoading();
                _that.setData({
                    brandList: brandList,
                    filterList: brandList,
                    brandAllList: brandAllList,
                    searchValue: "",
                });

                // 空值提醒
                if (brandList == null || brandList.length == 0) {
                    wx.showToast({
                        title: "您所在的当前区域暂无品牌，可在右上方切换至您的注册地址。",
                        icon: 'none'
                    })
                }
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
        });
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
        
        if (filterList != null && filterList.length == 0) {
            wx.showToast({
                title: "当前无结果：请输入其他关键字",
                icon: 'none'
            });
        }
    },
    /**
     * 跳转品牌列表
     */
    toProductList: function(e) {
        var data = e.currentTarget.dataset.brand;
        wx.setStorageSync("brand", data.Brand);
        wx.setStorageSync("bigType", "");
        wx.setStorageSync("smallType", "");
        wx.setStorageSync('fatherUser', data.Fatheruser); //设置主账号
        wx.setStorageSync('morningSite', data.Ssitemorning); //设置早上站点
        wx.setStorageSync('afternoonSite', data.Ssiteafternoon); //设置下午站点
        wx.setStorageSync('everningSite', data.Ssiteevening); //设置晚上站点
        wx.setStorageSync('morningTime', data.Timemorning); //设置早上站点物流时间
        wx.setStorageSync('afternoonTime', data.Timeafternoon); //设置下午站点物流时间
        wx.setStorageSync('everningTime', data.Timeevening); //设置晚上站点物流时间
        wx.setStorageSync('site', data.Ssite); //设置鲜花站点
        wx.navigateTo({
            url: '../../pages/products/products',
        })
    }
})