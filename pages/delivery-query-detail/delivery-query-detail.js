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
            id: options.id
        });
        this.getInvoice();
    },
    /**
     * 获取订单详情列表
     */
    getInvoice: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Invoice/GetInvoice";
        var data = {
            memCode: wx.getStorageSync("memcode"),
            id: that.data.id
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
                var dataList = data.Rows;
                for (var i = 0; i < dataList.length; i++) {
                    dataList[i].Saledate = dataList[i].Saledate.substring(0, 10);
                }
                that.setData({
                    dataList: dataList
                })
            }
        })
    },
})