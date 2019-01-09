//app.js
App({
    onLaunch: function() {},
    /**
     * 用户点击退出登录
     */
    onLogout: function() {
        var app = this;
        var userInfo = wx.getStorageSync("userInfo");
        wx.clearStorage();
        if (userInfo != "") {
            wx.setStorage({
                key: 'userInfo',
                data: {
                    username: userInfo.username,
                    password: userInfo.password,
                    savePassword: userInfo.savePassword
                },
            })
        }
        app.setTimeout(function() {
            wx.navigateTo({
                url: '../../pages/login/login'
            })
        });
    },
    checkLogin: function() {
        var app = this;
        if (!wx.getStorageSync("memcode")) {
            app.showModal('请登录后操作', function(res) {
                app.onLogout();
            })
            console.log("登录验证失败");
            return false;
        }
        console.log("登录验证成功");
        return true;
    },
    /**
     * wx.setTimeout定时器封装
     * 
     * fun:执行的方法function()
     */
    setTimeout: function(fun) {
        var app = this;
        setTimeout(function() {
            app.showLoading({});
            setTimeout(function() {
                fun();
                app.hideLoading();
            }, 1000);
        }, 500);
    },
    navigateBack: function() {
        var app = this;
        app.setTimeout(function(res) {
            wx.navigateBack({});
        });
    },
    navigateToIndex: function() {
        wx.switchTab({
            url: '../../pages/index/index',
        })
    },
    /**
     * 显示加载
     */
    showLoading: function() {
        wx.showLoading({
            title: '加载中,请稍候……'
        })
    },
    /**
     * 隐藏加载
     */
    hideLoading: function() {
        wx.hideLoading();
    },
    /**
     * 对wx.showModal的封装
     */
    showModal: function(content, callback, showCancel) {
        wx.showModal({
            title: '温馨提示',
            content: content,
            showCancel: showCancel ? showCancel == true ? true : false : false,
            success: callback
        })
    },
    /**
     * 对wx.request的基本封装
     */
    request: function(url, data, callback) {
        var that = this;
        that.showLoading();
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            complete(res) {
                that.hideLoading();
            },
            success: callback
        })
    },
    /**
     * 日期格式化
     */
    formatDate: function(date, format) {
        if (!date || !format) {
            return "";
        }
        //Date.prototype.format = function(format){ 
        //}

        // 月(时分也一样)-- MM:07,11; M:7,11
        var o = {
            "M+": date.getMonth() + 1, //month 
            "d+": date.getDate(), //day 
            "h+": date.getHours(), //hour 
            "m+": date.getMinutes(), //minute 
            "s+": date.getSeconds(), //second 
            "q+": Math.floor((date.getMonth() + 3) / 3), //quarter 
            "S": date.getMilliseconds() //millisecond
        };

        // 年 yyyy
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        // 星期 w
        if (/(w+)/.test(format)) {
            var weekArr = ["日", "一", "二", "三", "四", "五", "六"];
            format = format.replace(RegExp.$1, weekArr[date.getDay()]);
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    },
    uuid: function() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = "-";

        var uuid = s.join("");
        return uuid;
    },
    globalData: {
        userInfo: null,
        // API_URL
        appUrl: "https://api.xy431.com",
        // QINIU_PREFIX
        qiniuPrefix: "http://complaint.brightenflower.cn/",
        // 大图前缀
        imgPrefix: "http://img.brightenflower.cn/",
        // 缩略图前缀
        thumbnailsPrefix: "http://www.brightenflower.cn/PicPath/img/",
        // 腾讯位置服务
        MapsKey: "LGFBZ-IRO6I-FQDGC-5YPUC-XPDK5-BVBDR",
    }
})