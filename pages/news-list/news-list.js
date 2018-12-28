var app = getApp();
// pages/news-list/news-list.js
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
        console.log(options);
        var type = parseInt(options.t);
        var title = "最新消息"
        switch (type) {
            case 1:
                title = "最新消息";
                break;
            case 2:
                title = "物流信息";
                break;
            case 3:
                title = "常见问题";
                break;
        }
        wx.setNavigationBarTitle({
            title: title,
        })
        this.setData({
            title: title,
            type: type
        });
        this.getInformationList();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    /**
     * 获取资讯列表
     */
    getInformationList: function() {
        var that = this;
        wx.showLoading({
            title: '加载中，请稍候...'
        })
        wx.request({
            url: app.globalData.appUrl + '/Information/GetInformationList',
            data: {
                pageSize: 100,
                Isvalid: "上线",
                cType: that.data.title
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                that.setData({
                    list: data.Rows
                })
                wx.hideLoading();
            }
        })
    },
    toDetail(even) {
        var id = even.currentTarget.dataset.id;
        wx.navigateTo({
            url: '../../pages/news-detail/news-detail?id=' + id,
        })
    }
})