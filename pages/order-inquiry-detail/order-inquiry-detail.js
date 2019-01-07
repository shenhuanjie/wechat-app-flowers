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
            orderNum: options.code
        });
        this.getListByUserCode();
    },
    bindSwitchTab: function(even) {
        this.setData({
            selectedIndex: even.currentTarget.dataset.index
        })
    },
    /**
     * 获取订单详情列表
     */
    getListByUserCode: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Ordercommit/GetListByUserCode";
        var data = {
            orderNum: that.data.orderNum,
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
                var dataList = data.Rows;
                for (var i = 0; i < dataList.length; i++) {
                    dataList[i].Commitedate = dataList[i].Commitedate.substring(0, 10);
                }
                that.setData({
                    dataTotal: data.Total,
                    dataList: dataList
                })
            }
        })
    },
})