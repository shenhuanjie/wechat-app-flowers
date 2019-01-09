const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            id: options.id,
            buyWay: options.buyway
        });
        this.getVOrderList();
    },
    getVOrderList: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Ordercommit/GetVOrderList";
        var data = {
            Id: that.data.id,
            Buyway: that.data.buyWay,
            memCode: wx.getStorageSync("memcode"),
            pageSize: 1
        }
        console.log(data);
        app.request(url, data, function(res) {
            var data = res.data;
            console.log(data);
            that.setData({
                dataTotal: data.Total,
                dataList: data.Rows
            })
        });
    }
})