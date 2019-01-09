var app = getApp();
// pages/favorite/favorite.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memcode: "",
        saleDate: "",
        site: "",
        isHideLoadMore: false,
        imgPrefix: app.globalData.imgPrefix,
        page: 1,
        flitersList: [{
            title: "分类",
            selected: "fliters-item-selected",
            isIcon: false,
            icon: "follow"
        }, {
            title: "关注",
            selected: "",
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
        }],
        nofavorite: "您暂无关注的产品，快去关注您的最爱吧~"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _that = this;
        this.initView();
        this.getListByMemcode();
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
    initView: function() {
        var memcode = wx.getStorageSync("memcode") ? wx.getStorageSync("memcode") : "";
        var saleDate = app.formatDate((new Date()), "yyyy-MM-dd");
        var site = wx.getStorageSync("market") ? wx.getStorageSync("market") : "";
        this.setData({
            memcode: memcode,
            saleDate: saleDate,
            site: site
        });
        if (memcode == "") {
            app.onLogout();
        }
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
    getListByMemcode: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Mylove/GetListByMemcode";
        var data = {
            memCode: that.data.memcode,
            saleDate: that.data.saleDate,
            site: that.data.site,
            pageSize: 200
        }
        app.request(url, data, function(res) {
            var productList = res.data.Rows;
            console.log(productList);
            if (productList && productList.length == 0) {
                wx.showToast({
                    title: that.data.nofavorite,
                    icon: 'none'
                })
            } else {
                that.setData({
                    productList: productList
                })
            }
        })
    }
})