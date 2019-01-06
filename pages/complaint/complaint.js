const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ddlType: ["品质", "损坏", "少货", "其他"],
        index: -1,
        dataTitle: "",
        dataMsg: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    bindTitle: function(event) {
        this.setData({
            dataTitle: event.detail.value
        });
    },
    bindMsg: function(event) {
        this.setData({
            dataMsg: event.detail.value
        });
    },
    bindPickerChange: function(even) {
        console.log(even);
        var index = parseInt(even.detail.value);
        this.setData({
            index: index
        })
    },
    bindSubmit: function(even) {
        var that = this;
        var index = this.data.index;
        var dataType = this.data.ddlType[index];
        var dataTitle = this.data.dataTitle;
        var dataMsg = this.data.dataMsg;

        var checkFlat = true;
        var errorMsg = "";
        if (dataTitle == "") {
            errorMsg = "请输入主题";
            checkFlat = false;
        } else if (checkFlat && dataType == -1) {
            errorMsg = "请选择类型";
            checkFlat = false;
        } else if (checkFlat && dataMsg == "") {
            errorMsg = "请输入投诉建议内容";
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
        var url = app.globalData.appUrl + "/Complain/Save";
        var data = {
            memCode: wx.getStorageSync("memcode"),
            title: that.data.dataTitle,
            message: that.data.dataMsg,
            cType: that.data.dataType,
            // pic: null
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
    }
})