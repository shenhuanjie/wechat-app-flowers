var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        app: app,
        code: "",
        memCode: "",
        follow: {
            tip: "关注",
            loveId: 0
        },
        saleDate: app.formatDate((new Date()), "yyyy-MM-dd"),
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
        var _that = this;

        var code = options.productId;
        var memCode = wx.getStorageSync('memcode');
        var buyWay = wx.getStorageSync('buyWay');
        var market = wx.getStorageSync("market");
        this.setData({
            buyWay: buyWay,
            memCode: memCode,
            code: code,
            market: market
        })

    },
    /**
     * 切换到首页
     */
    switchIndex: function() {
        wx.switchTab({
            url: '../../pages/index/index',
        })
    },
    /**
     * 联系客服
     */
    switchChat: function() {
        wx.showToast({
            title: '客服电话：020-88888888',
            icon: "none"
        })
    },
    addMyLove: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Mylove/AddOrUpdateFromH5";
        var data = {
            Orderuser: this.data.memCode,
            Code: this.data.product.Code,
            Id: this.data.follow.loveId
        }

        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                console.log(data);
                var follow = that.data.follow;
                var loveId = parseInt(data.RecordId);
                if (loveId > 0) {
                    follow.loveId = loveId;
                    follow.tip = "已关注"
                    //已关注
                } else {
                    //为未关注
                    follow.loveId = loveId;
                    follow.tip = "关注"
                }
                that.setData({
                    follow: follow
                })
                wx.showToast({
                    title: data.Msg,
                    icon: "none"
                })
            }
        })
    },
    getVProduct: function() {
        var _that = this;
        var codeType = this.data.code;
        //基础产品数据接口
        var url = app.globalData.appUrl + "/Product/GetVProduct";
        var data = {
            site: this.data.market,
            code: this.data.code,
            saleDate: this.data.saleDate,
            buyWay: this.data.buyWay
        }
        //code大于4位时，切换到单一产品接口
        if (codeType > 9999) {
            url = app.globalData.appUrl + "/Product/GetProductDetail";
            data = {
                productId: this.data.code
            }
            codeType = 1;
        } else {
            codeType = 0;
        }
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data.VProduct);
                var product = res.data.VProduct;
                if (codeType == 0) { //code大于4位时，处理特殊数据
                    product.Price = product.Miprice + "~" + product.Maprice;
                    product.Picpath = product.Piclist.split(",")[0];
                }
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