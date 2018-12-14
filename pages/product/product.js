var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        app:app,
        productId: "",
        product: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        this.initView(options);
        this.getVProduct();
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
    initView: function(options) {
        var productId = options.productId;
        if (typeof(productId) == "undefined") {
            console.log("initView:Error");
            return 0;
        }
        this.setData({
            productId: productId
        })
    },
    getVProduct: function() {
        var _that = this;
        var productId = this.data.productId;
        if (productId == "") {
            console.log("getVProduct:Error");
            return 0;
        }
        var code = "";
        var site = "";
        wx.request({
            url: app.globalData.appUrl + '/Product/GetVProduct',
            data: {
                id: productId,
                code: code,
                site: site
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data.Rows);
                var product = res.data.Rows;
                _that.setData({
                    product: product
                })
                wx.setNavigationBarTitle({
                    title: product.Name
                })
            }
        })
    }
})