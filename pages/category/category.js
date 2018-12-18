var app = getApp();
// pages/category/category.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memcode: null,
        lclass: [],
        sclass: [],
        currentLsort: 0,
        currentSsort: [],
        single: true, //默认单选
        flitersList: [{
            title: "分类",
            selected: "fliters-item-selected",
            isIcon: false,
            icon: "follow"
        }, {
            title: "关注",
            selected: '',
            isIcon: true,
            icon: "follow"
        }, {
            title: "现售",
            selected: '',
            isIcon: false,
            icon: "follow"
        }, {
            title: "预定",
            selected: '',
            isIcon: false,
            icon: "follow"
        }, {
            title: "竞购",
            selected: '',
            isIcon: false,
            icon: "follow"
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        //初始化页面参数
        this.initView();
        this.getProductclassaList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

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
        var lSort = this.data.currentLsort;

        var currentSsort = this.data.currentSsort;

        var sclass = this.data.sclass;
        var single = this.data.single;

        if (single == true) {
            currentSsort = [];
            for (var i = 0; i < sclass.length; i++) {
                var item = sclass[i];
                if (item.Lsort == lSort && item.Ssort == sSort) {
                    currentSsort.push(item);
                    sclass[i].selected = true;
                } else {
                    sclass[i].selected = false;
                }
            }
        } else {

        }

        this.setData({
            currentSsort: currentSsort,
            sclass: sclass
        });
        if (single == true) {
            this.toProducts();
        }
    },
    /**
     * 初始化参数
     */
    initView: function() {
        var _that = this;
        _that.setData({
            memcode: wx.getStorageSync("memcode")
        })
    },
    toProducts: function() {
        var bigType = [];
        var smallType = [];
        var currentSsort = this.data.currentSsort;
        for (var i = 0; i < currentSsort.length; i++) {
            var item = currentSsort[i];
            var lclass = item.Lclass;
            var sclass = item.Sclass;
            if (bigType.join(',').indexOf(lclass) == -1) {
                bigType.push(lclass);
            }
            if (smallType.join(',').indexOf(sclass) == -1) {
                smallType.push(sclass);
            }
        }
        wx.setStorageSync('bigType', bigType);
        wx.setStorageSync('smallType', smallType);

        wx.navigateBack()
        // url: '../../pages/products/products',

    },
    getProductclassaList: function() {
        var _that = this;
        app.showLoading();
        var url = app.globalData.appUrl + "/Productclassa/GetProductclassaList";
        wx.request({
            url: url,
            data: {
                pageSize: 1000
            },
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
                _that.setData({
                    lclass: lclass,
                    sclass: sclass,
                })
            }
        })

    }
})