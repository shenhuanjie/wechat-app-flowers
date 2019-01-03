// pages/delivery-query/delivery-query.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dateStart: app.formatDate((new Date()), "yyyy-MM-dd"),
        dateEnd: app.formatDate((new Date()), "yyyy-MM-dd"),
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

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