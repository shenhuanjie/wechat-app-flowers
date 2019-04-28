var app = getApp();
// pages/register/register.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        username: "",
        password: "",
        confirmPassword: "",
        phone: "",
        mail: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            phone: options.phone
        });
    },
    /**
     * 用户名输入监听
     */
    bindUserName: function(event) {
        this.setData({
            username: event.detail.value
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
     * 邮箱输入监听
     */
    bindEmail: function(event) {
        this.setData({
            mail: event.detail.value
        });
    },
    /**
     * 保存
     */
    onSave: function() {
        var _that = this;

        var username = this.data.username;
        var password = this.data.password;
        var confirmPassword = this.data.confirmPassword;
        var phone = this.data.phone;
        var email = this.data.email;

        var checkFlat = true;
        var errorMsg = "";

        if (phone == "") {
            errorMsg = "非法操作";
            checkFlat = false;
        } else if (checkFlat && username == "") {
            errorMsg = "请输入你的用户名";
            checkFlat = false;
        } else if (checkFlat && password == "") {
            errorMsg = "请输入你的密码";
            checkFlat = false;
        } else if (checkFlat && confirmPassword == "") {
            errorMsg = "请输入确认密码";
            checkFlat = false;
        } else if (checkFlat && password != confirmPassword) {
            errorMsg = "两次密码不一致，请重新输入";
            checkFlat = false;
        } else if (checkFlat && email == "") {
            errorMsg = "请输入邮箱";
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
            url: app.globalData.appUrl + '/Member/UpdateInfo',
            data: {
                userName: username,
                pwd: password,
                phone: phone,
                email: email
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
                        title: "恭喜您，已完成注册！",
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
    /**
     * 跳转平台首页
     */
    toIndex() {
        console.log("onLogin");
        wx.switchTab({
            url: '../../pages/index/index',
        })
    }
})