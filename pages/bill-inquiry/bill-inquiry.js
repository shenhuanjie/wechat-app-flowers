const app = getApp();
// pages/order-inquiry/order-inquiry.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dateStart: app.formatDate((new Date()), "yyyy-MM-dd"),
        dateEnd: app.formatDate((new Date()), "yyyy-MM-dd"),
        dataTotal: 0,
        dataList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getOrderListByUserCode();
    },
    /**
     * 获取订单查询列表
     */
    getOrderListByUserCode() {
        var that = this;
        var url = app.globalData.appUrl + "/Payrecord/GetListByUserCode";
        var data = {
            startTime: that.data.dateStart,
            endTime: that.data.dateEnd,
            memCode: wx.getStorageSync("memcode"),
            pageSize: 1000
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
                    dataTotal: data.Total,
                    dataList: data.Rows
                })
            }
        })
    },
    /**
     * 绑定查询按钮
     */
    bindSearch: function (e) {
        this.getOrderListByUserCode();
    },
    /**
     * 绑定日期选择器事件
     */
    bindDateChange: function (e) {
        var that = this;
        console.log(e);
        console.log('picker发送选择改变，携带值为', e.detail.value)
        if (e.currentTarget.id == "dateStart") {
            var dateStart = e.detail.value;
            var dateEnd = that.data.dateEnd;
            var _date = e.detail.value;
            if (dateStart > dateEnd) {
                _date = dateStart;
                dateStart = dateEnd;
                dateEnd = _date;
            }
            that.setData({
                dateStart: dateStart,
                dateEnd: dateEnd
            })
        } else if (e.currentTarget.id == "dateEnd") {
            var dateStart = that.data.dateStart;
            var dateEnd = e.detail.value;
            var _date = e.detail.value;
            if (dateEnd < dateStart) {
                _date = dateEnd;
                dateEnd = dateStart;
                dateStart = _date;
            }
            that.setData({
                dateStart: dateStart,
                dateEnd: dateEnd
            })
        }
    },
})