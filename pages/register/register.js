var app = getApp();
var ImageUtil = require('../../utils/WxImageUtil.js');
// pages/register/register.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: "",
        validCode: "",
        recommendCode: "", //推荐码
        readAndAgree: false, //阅读并接受

        tip: "获取验证码",
        disabled: "",
        countdown: 120,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},
    /**
     * 监听手机号
     */
    bindPhone: function(event) {
        this.setData({
            phone: event.detail.value
        });
    },
    /**
     * 监听验证码
     */
    bindValidCode: function(event) {
        this.setData({
            validCode: event.detail.value
        });
    },
    /**
     * 选项框监听
     */
    checkboxChange: function(e) {
        if (e.detail.value == "") {
            this.setData({
                readAndAgree: false
            })
        } else {
            this.setData({
                readAndAgree: true
            })
        }
    },
    onValidCode: function() {
        var _that = this;
        var phone = _that.data.phone;

        var checkFlat = true;
        var errorMsg = "";

        if (checkFlat && phone == "") {
            errorMsg = "请输入你的手机号";
            checkFlat = false;
        } else if (checkFlat && !(/^1\d{10}$/.test(phone))) {
            errorMsg = "请输入正确的手机号";
            checkFlat = false;
        }
        if (!checkFlat) {
            wx.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        //验证码计时
        _that.countDown();

        // 发送请求
        wx.request({
            url: app.globalData.appUrl + '/Sms/SendSms',
            data: {
                phone: phone
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                console.log(data);
                var msg = data.Msg;
                if (data.Success) {
                    wx.showToast({
                        title: "验证码发送成功，请注意查收",
                        icon: 'none',
                        duration: 2000
                    });
                } else {
                    wx.showToast({
                        title: msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    onChooseImg: function() {
        // var imgPath = ImageUtil.chooseImage();
        // var result = ImageUtil.scanCode();

        var that = this;
        // 允许从相机和相册扫码
        wx.scanCode({
            success(res) {
                console.log(res);
                that.setData({
                    recommendCode: res.result
                })
                console.log(that.data.recommendCode);
            }
        })
    },
    /**
     * 注册
     */
    onRegister: function() {
        var _that = this;
        var guid = this.data.guid;

        var username = this.data.username;
        var password = this.data.password;
        var confirmPassword = this.data.confirmPassword;
        var linkman = this.data.linkman;
        var phone = this.data.phone;
        var validCode = this.data.validCode;
        var readAndAgree = this.data.readAndAgree;
        var recommendCode = this.data.recommendCode;

        var checkFlat = true;
        var errorMsg = "";

        if (checkFlat && phone == "") {
            errorMsg = "请输入你的手机号";
            checkFlat = false;
        } else if (checkFlat && validCode == "") {
            errorMsg = "请输入验证码";
            checkFlat = false;
        } else if (checkFlat && !readAndAgree) {
            errorMsg = "请阅读并同意协议";
            checkFlat = false;
        }
        if (!checkFlat) {
            wx.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 2000
            })
            return false;
        }
        if (recommendCode == "") {
            recommendCode = 'brightenit';
        }
        // 验证通过
        wx.request({
            url: app.globalData.appUrl + '/Member/Reg',
            data: {
                name: phone,
                pwd: phone,
                phone: phone,
                validCode: validCode,
                linkman: recommendCode,
                introDept: recommendCode,
                introMgr: recommendCode,
                serviceDept: '',
                serviceMgr: ''
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                console.log(data);
                var msg = data.Msg;
                if (data.Success) {
                    wx.showToast({
                        title: "注册成功，请继续完善个人信息",
                        icon: 'none',
                        duration: 2000
                    });
                    setTimeout(function() {
                        _that.toRegisterConfirm();
                    }, 1000);
                } else {
                    wx.showToast({
                        title: msg,
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    },
    /**
     * 跳转会员协议
     */
    toAgreement() {
        console.log("toAgreement");
        wx.navigateTo({
            url: '../../pages/agreement/agreement'
        })
    },
    toRegisterConfirm() {
        console.log("toRegisterConfirm");
        wx.navigateTo({
            url: '../../pages/register-confirm/register-confirm?phone=' + this.data.phone
        })
    },
    /**
     * 跳转登录
     */
    toLogin() {
        console.log("toLogin");
        wx.navigateTo({
            url: '../../pages/login/login'
        })
    },
    /**
     * 刷新验证码
     */
    toChangeImg: function() {
        var _that = this;
        var _uuid = app.uuid();
        _that.setData({
            "imgCode": app.globalData.appUrl + "/RandomCode/GetRandomCode?guid=" + _uuid,
            "guid": _uuid
        })
    },
    //倒计时
    countDown: function() {
        var _that = this;
        var countdown = _that.data.countdown;
        var disabled = _that.data.disabled;
        var tip = _that.data.tip;
        if (countdown == 0) {
            _that.setData({
                disabled: "",
                tip: "获取验证码",
                countdown: 120
            })
            return;
        } else {
            countdown--
            _that.setData({
                disabled: "disabled",
                tip: "重新发送(" + countdown + ")",
                countdown: countdown
            })
        }
        setTimeout(function() {
            _that.countDown()
        }   , 1000)
    }
})