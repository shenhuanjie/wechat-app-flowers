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
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (!app.checkLogin()) {
            return false;
        }
        this.getConfirmList();
    },
    bindToPay: function() {
        var that = this;
        var addressList = this.data.addressList;
        if (Array.prototype.isPrototypeOf(addressList) && addressList.length === 0) {
            wx.showModal({
                title: '提示',
                content: '您还没添加默认收货地址哦~',
                success(res) {
                    if (res.confirm) {
                        setTimeout(function() {
                            wx.showLoading({});
                            setTimeout(function() {
                                that.bindAddress();
                                wx.hideLoading();
                            }, 1000);
                        }, 500);
                    }
                }
            })
            return 0;
        }

        var dataList = [];
        var cartList = that.data.cartList;
        for (var i = 0; i < cartList.length; i++) {
            var id = cartList[i].Id;
            var num = cartList[i].Ordercount;
            dataList.push(id + "_" + num);
        }
        wx.setStorageSync("cart", dataList.join(','));

        wx.setStorageSync("orderRemark", that.data.orderRemark);
        wx.navigateTo({
            url: '../../pages/pay/pay',
        })
    },
    bindAddress: function() {
        var isback = 1; //传参数返回
        wx.navigateTo({
            url: '../../pages/address-list/address-list?isback=' + isback,
        })
    },
    bindRemark: function(e) {
        this.setData({
            orderRemark: e.detail.value
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
                    var addressList = res.data.AddressList;
                    if (Array.prototype.isPrototypeOf(addressList) && addressList.length === 0) {
                        wx.showModal({
                            title: '提示',
                            content: '您还没添加默认收货地址哦~',
                            success(res) {
                                if (res.confirm) {
                                    setTimeout(function() {
                                        wx.showLoading({});
                                        setTimeout(function() {
                                            that.bindAddress();
                                            wx.hideLoading();
                                        }, 1000);
                                    }, 500);
                                }
                            }
                        })
                    }
                    var cartList = res.data.CartList;
                    var totalAmount = res.data.TotalAmount;
                    wx.setStorageSync("totalAmount", totalAmount)
                    that.setData({
                        addressList: addressList,
                        cartList: cartList,
                        totalAmount: totalAmount
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