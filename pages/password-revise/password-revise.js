const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        password_old: "",
        password_old_: "",
        password_new: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.getMemberByCode();
    },
    bindPassword: function(event) {
        var id = event.target.id;
        var value = event.detail.value;
        var password_old = this.data.password_old;
        var password_old_ = this.data.password_old_;
        var password_new = this.data.password_new;
        if (id == "password_old") {
            password_old = value;
        } else if (id == "password_old_") {
            password_old_ = value;
        } else if (id == "password_new") {
            password_new = value;
        }
        this.setData({
            password_old: password_old,
            password_old_: password_old_,
            password_new: password_new
        });
    },
    bindSubmit: function() {
        var that = this;
        var password_old = this.data.password_old;
        var password_old_ = this.data.password_old_;
        var password_new = this.data.password_new;

        var checkFlat = true;
        var errorMsg = "";
        if (password_old == "") {
            errorMsg = "请输入旧密码";
            checkFlat = false;
        } else if (checkFlat && password_old_ == "") {
            errorMsg = "请在输入旧密码";
            checkFlat = false;
        } else if (checkFlat && password_new == "") {
            errorMsg = "请输入新密码";
            checkFlat = false;
        } else if (checkFlat && password_old != password_old_) {
            errorMsg = "两次密码输入不一致";
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
        that.doChangePwd();
    },
    doChangePwd: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Member/ChangePwd";
        var data = {
            memCode: wx.getStorageSync("memcode"),
            oldPwd: that.data.password_old,
            newPwd: that.data.password_new
        }
        console.log(data);
        wx.request({
            url: url,
            data: data,
            method: "POST",
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                var Msg = data.Msg;
                var Success = data.Success;
                console.log(data);
                
                wx.showToast({
                    title: Msg,
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    /**
     * 获取用户信息
     */
    getMemberByCode: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Member/GetMemberByCode";
        var data = {
            memCode: wx.getStorageSync("memcode"),
        }
        console.log(data);
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                console.log(data);
                that.setData({
                    member: data.Member
                })
            }
        })
    }
})