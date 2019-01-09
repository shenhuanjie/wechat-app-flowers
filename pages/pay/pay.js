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
            color: "font-color-green",
            bgcolor:"font-color-green"
        }, {
            name: "余额钱包",
            icon: "icon-shouzhimingxicaifuqianbao",
            color: "font-color-yellow",
            bgcolor: "font-color-green"
        }],
        dataIndex: -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            appid: app.globalData.AppID,
            secret: app.globalData.AppSecret
        })
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
            app.showModal('请勿重复提交订单');
            return;
        }
        this.createOrder();
    },
    /**
     * 创建订单
     */
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
     * 
     * TODO:https://developers.weixin.qq.com/miniprogram/dev/api/wx.requestPayment.html
     */
    wechatPay: function() {
        var that = this;
        app.showModal('微信支付正在开发中', function(res) {
            var dataList = that.data.dataList;
            dataList[0].color = "font-color-gray";
            dataList[0].bgcolor = "font-color-gray";
            that.setData({
                dataList: dataList
            })
        });


        wx.login({
            success(res) {
                if (res.code) {
                    console.log(res);
                    // 发起网络请求
                    wx.request({
                        url: 'https://api.weixin.qq.com/sns/jscode2session',
                        data: {
                            appid: app.globalData.AppID,
                            secret: app.globalData.AppSecret,
                            js_code: res.code,
                            grant_type: "authorization_code"
                        },
                        success(res) {
                            console.log(res.data);
                            var data = res.data;
                            if (data.errcode) {
                                var errmsg = data.errmsg;
                                var errcode = data.errcode;
                                switch (errcode) {
                                    case -1:
                                        console.log("系统繁忙，此时请开发者稍候再试");
                                        break;
                                    case 0:
                                        console.log("请求成功");
                                        break;
                                    case 40029:
                                        console.log("code 无效");
                                        break;
                                    case 45011:
                                        console.log("频率限制，每个用户每分钟100次");
                                        break;
                                    default:
                                        console.log(errmsg);
                                        break;
                                }
                                return 0;
                            }
                            that.setData({
                                session_key: data.session_key,
                                openid: data.openid
                            })
                            that.unifiedorder();
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    },
    unifiedorder: function() {
        var that = this;
        // 发起网络请求
        wx.request({
            url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
            data: {
                appid: that.data.appid,
                mch_id: "1230000109",
                device_info: "013467007045764",
                nonce_str: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
                sign: "C380BEC2BFD727A4B6845133519F3AD6",
                sign_type: "MD5",
                body: "腾讯充值中心-QQ会员充值",
                detail: "",
                attach: "深圳分店",
                out_trade_no: "20150806125346",
                fee_type: "CNY",
                total_fee: "88",
                spbill_create_ip: "123.12.12.123",
                time_start: "20091225091010",
                time_expire: "20091227091010",
                goods_tag: "WXG",
                notify_url: "http://www.weixin.qq.com/wxpay/pay.php",
                trade_type: "JSAPI",
                product_id: "12235413214070356458058",
                limit_pay: "no_credit",
                openid: that.data.openid,
                receipt: "Y",
                scene_info: {
                    "store_info": {
                        "id": "SZTX001",
                        "name": "腾大餐厅",
                        "area_code": "440305",
                        "address": "科技园中一路腾讯大厦"
                    }
                }

            },
            header: {
                'content-type': 'application/xml'
            },
            method: "POST",
            success(res) {
                console.log(res.data);
                var data = res.data;
                if (data.errcode) {
                    var errmsg = data.errmsg;
                    var errcode = data.errcode;
                    switch (errcode) {
                        case -1:
                            console.log("系统繁忙，此时请开发者稍候再试");
                            break;
                        case 0:
                            console.log("请求成功");
                            break;
                        case 40029:
                            console.log("code 无效");
                            break;
                        case 45011:
                            console.log("频率限制，每个用户每分钟100次");
                            break;
                        default:
                            console.log(errmsg);
                            break;
                    }
                    return 0;
                }
            }
        })
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
        app.request(url, data, function(res) {
            console.log(res.data);
            if (!res.data.Success) {
                var msg = res.data.Msg;
                app.showModal(msg);
                that.setData({
                    isCreateOrder: false
                })
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
                    app.showModal("支付成功", function(res) {
                        app.setTimeout(function(res) {
                            app.navigateToIndex();
                        });
                    });
                }
            }
        })
    },
    getMemberByCode: function() {
        app.showLoading();
        var that = this;
        var url = app.globalData.appUrl + '/Member/GetMemberByCode'
        var data = {
            memcode: wx.getStorageSync("memcode")
        }
        app.request(url, data, function(res) {
            var member = res.data.Member;
            if (member && member.Id > 0) {
                that.setData({
                    member: member
                });
            }
        })
    }
})