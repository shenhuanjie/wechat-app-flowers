const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isCreateOrder: false,
        dataList: [{
            name: "微信",
            icon: "icon-weixinzhifu",
            color: "font-color-green"
        }, {
            name: "余额钱包",
            icon: "icon-shouzhimingxicaifuqianbao",
            color: "font-color-yellow"
        }],
        dataIndex: -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    onShow: function() {
        this.setData({
            totalAmount: wx.getStorageSync("totalAmount")
        })
        this.getMemberByCode();
    },
    bindSwitchTab: function(e) {
        this.setData({
            dataIndex: e.currentTarget.dataset.index
        })
    },
    bindSubmit: function() {
        var isCreateOrder = this.data.isCreateOrder;
        if (isCreateOrder) {
            wx.showToast({
                title: '请勿重复提交订单',
                icon: 'none'
            });
            return;
        }
        this.createOrder();
    },
    createOrder: function() {
        var that = this;
        var dataIndex = this.data.dataIndex;
        switch (dataIndex) {
            case -1:
                wx.showToast({
                    title: '请选择支付方式',
                    icon: 'none'
                });
                break;
            case 0:
                that.wechatPay();
                break;
            case 1:
                that.balancePay();
                break;
        }
    },
    /**
     * 微信支付
     */
    wechatPay: function() {
        wx.showToast({
            title: '微信支付正在开发中',
            icon: 'none'
        });
    },
    /**
     * 余额支付
     */
    balancePay: function() {
        var that = this;
        var payWay = that.data.dataIndex;
        that.setData({
            isCreateOrder: true
        })
        var url = app.globalData.appUrl + '/Orderdg/CreateOrder'
        var data = {
            cart: wx.getStorageSync("cart"),
            orderUser: wx.getStorageSync("memcode"),
            remark: wx.getStorageSync('orderRemark'),
            fatherUser: wx.getStorageSync('fatherUser') ? wx.getStorageSync('fatherUser') : "9995"
        }
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data);
                if (!res.data.Success) {
                    wx.showToast({
                        title: res.data.Msg,
                        icon: 'none'
                    });
                } else {
                    if (payWay == 0) {
                        var requestStr = data.obj.alipayReqStr; //支付串
                        // mui.toast('创建订单完成，正在跳转支付宝支付');
                        // plus.payment.request(channel, requestStr, function (result) {
                        //     plus.nativeUI.alert("支付成功！", function () {
                        //         mui.back();
                        //         return;
                        //     });
                        // }, function (error) {
                        //     plus.nativeUI.alert("支付失败！(代码：" + error.code + ")");
                        // });
                    } else {
                        wx.showToast({
                            title: "支付成功",
                            icon: 'none'
                        });
                        setTimeout(function() {
                            wx.showLoading({});
                            setTimeout(function() {
                                wx.switchTab({
                                    url: '../../pages/index/index',
                                })
                                wx.hideLoading();
                            }, 1000);
                        }, 500);
                        return;
                    }
                }
            }
        })
    },
    getMemberByCode: function() {
        var that = this;
        var url = app.globalData.appUrl + '/Member/GetMemberByCode'
        var data = {
            memcode: wx.getStorageSync("memcode")
        }
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var member = res.data.Member;
                if (member && member.Id > 0) {
                    that.setData({
                        member: member
                    });
                }
            }
        })
    }
})