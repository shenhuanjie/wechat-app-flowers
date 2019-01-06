const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataMsg: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    bindInput: function(even) {
        this.setData({
            dataMsg: even.detail.value
        })
    },
    bindSubmit: function() {
        var that = this;
        var dataMsg = this.data.dataMsg;

        var checkFlat = true;
        var errorMsg = "";
        if (dataMsg == "") {
            errorMsg = "请输入文字留言";
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
        that.doSubmit();
    },
    doSubmit: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Ordermessage/Save";
        var data = {
            memCode: wx.getStorageSync("memcode"),
            message: that.data.dataMsg
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
                if (Success) {
                    setTimeout(function() {
                        wx.navigateBack({})
                    }, 2000)
                }
            }
        })
    }
})