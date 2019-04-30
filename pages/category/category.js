var app = getApp();
// pages/category/category.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memcode: wx.getStorageSync("memcode"),
        lclass: [],
        sclass: [],
        currentLsort: 0,
        currentSsort: [],
        single: true, //默认单选
        brand: wx.getStorageSync("brand"),
        site: wx.getStorageSync("site")
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getRetailandclassList();
    },
    bindSingle: function() {
        this.setData({
            single: !this.data.single
        })
    },
    getRetailandclassList: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Retailandclass/GetRetailandclassList";
        var data = {
            pageSize: 1000,
            bBrand: this.data.brand,
            bSite: this.data.site
        }
        app.showLoading();
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            success(res) {
                wx.hideLoading();
                var list = res.data.Rows;
                console.log(list);

                var lclass = [];
                var sclass = [];
                var lsort = -1;
                var ssort = -1;

                for (var i = 0; i < list.length; i++) {
                    var item = list[i];
                    item.selected = false;
                    if (lsort < item.Lsort) {
                        lsort = item.Lsort
                        lclass.push(item);
                    }
                    sclass.push(item);
                }

                that.setData({
                    lclass: lclass,
                    sclass: sclass,
                })
                that.initSelectLclass();
            }
        })

    },

    /**
     * 初始选择
     */
    initSelectLclass: function() {
        var lclass = this.data.lclass;
        if (lclass.length != 0) {
            lclass[0].selected = true;
        }
        this.setData({
            currentLsort: lclass[0].Lsort,
            lclass: lclass
        })
    },
    /**
     * 选择大类
     */
    onSelectLclass: function(even) {
        console.log(even);
        var currentLsort = even.currentTarget.dataset.currentLsort;
        var lclass = this.data.lclass;
        for (var i = 0; i < lclass.length; i++) {
            var item = lclass[i];
            if (item.Lsort == currentLsort) {
                lclass[i].selected = true;
            } else {
                lclass[i].selected = false;
            }
        }
        this.setData({
            currentLsort: even.currentTarget.dataset.currentLsort,
            lclass: lclass
        })
    },
    onSelectSclass: function(even) {
        console.log(even);

        var sSort = even.currentTarget.dataset.currentSsort;
        var sSortId = even.currentTarget.dataset.currentSsortId;
        var lSort = this.data.currentLsort;

        var currentSsort = this.data.currentSsort;

        var sclass = this.data.sclass;
        var single = this.data.single;

        if (single == true) {
            currentSsort = [];
            for (var i = 0; i < sclass.length; i++) {
                var item = sclass[i];
                if (item.Lsort == lSort && item.Ssort == sSort && item.Id == sSortId) {
                    currentSsort.push(item);
                    sclass[i].selected = true;
                } else {
                    sclass[i].selected = false;
                }
            }
        } else {
            currentSsort = [];
            for (var i = 0; i < sclass.length; i++) {
                var item = sclass[i];
                if (item.Lsort == lSort && item.Ssort == sSort && item.Id == sSortId) {
                    currentSsort.push(item);
                    sclass[i].selected = true;
                } 
            }
        }

        this.setData({
            currentSsort: currentSsort,
            sclass: sclass
        });
        if (single == true) {
            // this.toProducts();
        }
    },

    toProducts: function() {
        var bigType = [];
        var smallType = [];
        var currentSsort = this.data.currentSsort;
        for (var i = 0; i < currentSsort.length; i++) {
            var item = currentSsort[i];
            var lclass = item.Lclass;
            var sclass = lclass + "_" + item.Sclass;
            if (bigType.join(',').indexOf(lclass) == -1) {
                bigType.push(lclass);
            }
            if (smallType.join(',').indexOf(sclass) == -1) {
                smallType.push(sclass);
            }
        }
        // wx.setStorageSync('bigType', bigType);
        wx.setStorageSync('smallType', smallType);

        wx.navigateBack()
        // url: '../../pages/products/products',

    },

})