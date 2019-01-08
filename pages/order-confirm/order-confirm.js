const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgPrefix: app.globalData.imgPrefix,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (!app.checkLogin()) {
            return false;
        }
        this.setData({
            cartId: options.cartId
        })
        this.getConfirmList();
    },
    bindToPay: function() {
        wx.showToast({
            title: '去支付',
            icon: 'none'
        })
    },
    /**
     * 获取订单详情
     */
    getConfirmList: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Shoppingcart/GetConfirmList";
        var data = {
            cart: wx.getStorageSync("cart"),
            orderUser: wx.getStorageSync("memcode"),
            cartId: that.data.cartId,
        }
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data);
                if (res.data.Success) {
                    that.setData({
                        addressList: res.data.AddressList,
                        cartList: res.data.CartList,
                        totalAmount: res.data.TotalAmount
                    })
                } else {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none'
                    })
                    app.navigateBack();
                }
            }
        })
    }
})