var app = getApp();
// pages/cart/cart.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memcode: null,
        imgPrefix: app.globalData.imgPrefix,
        nofavorite: "您购物车暂无产品，快去关注您的最爱吧~",
        // input默认是1
        num: 1,
        // 使用data数据对象设置样式名
        minusStatus: 'disabled'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _that = this;
        this.initView();
        this.getShoppingList();
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

        this.setData({
            memcode: memcode
        });
        if (memcode == "") {
            app.onLogout();
        }
    },
    /* 点击减号 */
    bindMinus: function() {
        var num = this.data.num;
        // 如果大于1时，才可以减
        if (num > 1) {
            num--;
        }
        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num <= 1 ? 'disabled' : 'normal';
        // 将数值与状态写回
        this.setData({
            num: num,
            minusStatus: minusStatus
        });
    },
    /* 点击加号 */
    bindPlus: function() {
        var num = this.data.num;
        // 不作过多考虑自增1
        num++;
        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num < 1 ? 'disabled' : 'normal';
        // 将数值与状态写回
        this.setData({
            num: num,
            minusStatus: minusStatus
        });
    },
    /* 输入框事件 */
    bindManual: function(e) {
        var num = e.detail.value;
        // 将数值与状态写回
        this.setData({
            num: num
        });
    },
    getShoppingList: function() {
        app.showLoading();
        var that = this;
        var url = app.globalData.appUrl + "/Shoppingcart/GetShoppingcartList";
        wx.request({
            url: url,
            data: {
                Orderuser: that.data.memcode
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            success(res) {
                wx.hideLoading();
                var productList = res.data.Rows;
                console.log(productList);
                if (productList && productList.length == 0) {
                    wx.showToast({
                        title: "that.data.nofavorite",
                        icon: 'none'
                    })
                } else {
                    that.setData({
                        productList: productList
                    })
                }
            }
        })
    }
})