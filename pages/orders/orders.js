var app = getApp();
// pages/orders/orders.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList: [],
        fliterSelected: 0,
        flitersList: [{
            title: "全部",
        }, {
            title: "未付款",
        }, {
            title: "已付款",
        }, {
            title: "已完成",
        }],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getMyOrderListe();
    },
    /**
     * 绑定查询按钮
     */
    bindSwitchTab: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var dataList = [];
        switch (index) {
            case 0:
                dataList = that.data.allOrderList;
                break;
            case 1:
                dataList = that.data.cartList;
                break;
            case 2:
                dataList = that.data.unsendList;
                break;
            case 3:
                dataList = that.data.finishList;
                break;
        }
        this.setData({
            fliterSelected: index,
            dataList: dataList
        })
    },
    getMyOrderListe: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Ordercommit/GetMyOrderList";
        var data = {
            memCode: wx.getStorageSync("memcode")
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
                var dataList = [];
                var allOrderList = that.formatData(data.AllOrderList);
                var cartList = that.formatData(data.CartList);
                var unsendList = that.formatData(data.UnsendList);
                var finishList = that.formatData(data.FinishList);
                switch (that.data.fliterSelected) {
                    case 0:
                        dataList = allOrderList;
                        break;
                    case 1:
                        dataList = cartList;
                        break;
                    case 2:
                        dataList = unsendList;
                        break;
                    case 3:
                        dataList = finishList;
                        break;
                }
                that.setData({
                    dataList: dataList,
                    allOrderList: allOrderList,
                    cartList: cartList,
                    finishList: finishList,
                    unsendList: unsendList
                })
            }
        })
    },
    toOrderDetail: function(even) {
        console.log(even);
        var id = even.currentTarget.dataset.id;
        var buyway = even.currentTarget.dataset.buyway;
        var url = '../../pages/order-detail/order-detail?id=' + id + "&buyway=" + buyway;
        if (!buyway){
            url = '../../pages/order-confirm/order-confirm?id=' + id;
        }
        wx.navigateTo({
            url: url,
        })
    },
    formatData: function(data) {
        var that = this;
        for (var i = 0; i < data.length; i++) {
            data[i].Ordertime = app.formatDate((new Date(data[i].Ordertime)), "yyyy-MM-dd");
        }
        return data;
    },
})