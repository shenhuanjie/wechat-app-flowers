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
        if (!app.checkLogin()) {
            return false;
        }
        this.getMyOrderListe();
    },
    /**
     * 绑定查询按钮
     */
    bindSwitchTab: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        this.setData({
            fliterSelected: index,
        })
        this.getMyOrderListe();
    },
    getMyOrderListe: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Ordercommit/GetMyOrderList";
        var data = {
            memCode: wx.getStorageSync("memcode")
        }
        console.log(data);
        app.request(url, data, function(res) {
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
                    dataList = [];
                    for (var i = 0; i < finishList.length; i++) {
                        var item = finishList[i];
                        item.Ordertime = app.formatDate((new Date(item.Commitedate)), "yyyy-MM-dd");
                        item.Name = item.Ordernum;
                        dataList.push(item);
                    }
                    break;
            }
            that.setData({
                dataList: dataList,
                allOrderList: allOrderList,
                cartList: cartList,
                finishList: finishList,
                unsendList: unsendList
            })
        })
    },
    toOrderDetail: function(even) {
        var item = even.currentTarget.dataset.item;
        var url = "";

        switch (this.data.fliterSelected) {
            case 0:
                url = "../../pages/order-detail/order-detail?id=" + item.Id + "&buyway=" + item.Buyway;
                break;
            case 1:
                url = '../../pages/order-confirm/order-confirm?cartId=' + item.Id;
                break;
            case 2:
                url = '../../pages/product/product?id=' + item.Code;
                break;
            case 3:
                url = '../../pages/order-inquiry-detail/order-inquiry-detail?code=' + item.Ordernum;
                break;
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