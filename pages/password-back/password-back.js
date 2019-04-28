var app = getApp();
// pages/register/register.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: "",
        validCode: "",
        password: "",
        confirmPassword: "",

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
     * 密码输入监听
     */
    bindPassword: function(event) {
        this.setData({
            password: event.detail.value
        });
    },
    bindConfirmPassword: function(event) {
        this.setData({
            confirmPassword: event.detail.value
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
     * 获取验证码
     */
    onValidCode: function() {
        var _that = this;
        var phone = _that.data.phone;
        var validCode = _that.data.validCode;
        var password = _that.data.password;
        var confirmPassword = _that.data.confirmPassword;

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
    /**
     * 重置密码
     */
    onResetPassword: function() {
        var _that = this;
        var phone = this.data.phone;
        var password = this.data.password;
        var confirmPassword = this.data.confirmPassword;
        var validCode = this.data.validCode;


        var checkFlat = true;
        var errorMsg = "";

        if (checkFlat && phone == "") {
            errorMsg = "请输入你的手机号";
            checkFlat = false;
        } else if (checkFlat && validCode == "") {
            errorMsg = "请输入验证码";
            checkFlat = false;
        }  else if (checkFlat && password == "") {
            errorMsg = "请输入你的密码";
            checkFlat = false;
        } else if (checkFlat && confirmPassword == "") {
            errorMsg = "请输入确认密码";
            checkFlat = false;
        } else if (checkFlat && password != confirmPassword) {
            errorMsg = "两次密码不一致，请重新输入";
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
        // 验证通过
        wx.request({
            url: app.globalData.appUrl + '/Member/ResetPwd',
            data: {
                phone: phone,
                pwd: password,
                validCode: validCode
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
                        title: msg,
                        icon: 'none',
                        duration: 2000
                    });
                    setTimeout(function() {
                        _that.toLogin();
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
     * 跳转登录
     */
    toLogin() {
        console.log("toLogin");
        wx.navigateTo({
            url: '../../pages/login/login'
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