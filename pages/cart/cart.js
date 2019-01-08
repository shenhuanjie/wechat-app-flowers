var app = getApp();
// pages/cart/cart.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showEdit: false,
        dataTotal: 0,
        presellTotal: 0,
        saleTotal: 0,
        presellSelectAll: false,
        saleSelectAll: false,
        selectAll: false,
        fliterSelected: 0,
        flitersList: [{
            title: "预售",
        }, {
            title: "现售",
        }],
        memcode: null,
        imgPrefix: app.globalData.imgPrefix,
        nofavorite: "您购物车暂无产品，快去关注您的最爱吧~",
        // input默认是1
        num: 1,
        // 使用data数据对象设置样式名
        minusStatus: 'disabled'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (!app.checkLogin()) {
            return false;
        }
        var _that = this;
        this.initView();
        this.getShoppingList();
    },
    /**
     * 绑定查询按钮
     */
    bindSwitchTab: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var dataTotal = 0;
        var selectAll = false;
        switch (index) {
            case 0:
                dataTotal = that.data.presellTotal;
                selectAll = that.data.presellSelectAll;
                break;
            case 1:
                dataTotal = that.data.saleTotal;
                selectAll = that.data.saleSelectAll;
                break;
        }
        this.setData({
            fliterSelected: index,
            dataTotal: dataTotal,
            selectAll: selectAll
        })
    },
    bindShowEdit: function() {
        this.setData({
            showEdit: !this.data.showEdit
        })
    },
    bindDelItem: function() {
        var that = this;
        var type = this.data.fliterSelected;
        var dataList = [];
        var dataResultList = [];
        switch (type) {
            case 0:
                dataList = that.data.presellList;
                break;
            case 1:
                dataList = that.data.saleList;
                break;
        }

        for (var i = 0; i < dataList.length; i++) {
            var id = dataList[i].Id;
            if (!dataList[i].selected) {
                dataResultList.push(dataList[i]);
            } else {
                that.deleteCartItem(id);
            }
        }

        // 将数值与状态写回
        if (type == 0) {
            that.setData({
                presellList: dataResultList,
                presellTotal: 0,
                dataTotal: 0,
                selectAll: false,
                presellSelectAll: false,
                showEdit: false
            })
        } else if (type == 1) {
            that.setData({
                saleList: dataResultList,
                saleTotal: 0,
                dataTotal: 0,
                selectAll: false,
                saleSelectAll: false,
                showEdit: false
            })
        }
    },
    initView: function() {
        var memcode = wx.getStorageSync("memcode") ? wx.getStorageSync("memcode") : "";

        this.setData({
            memcode: memcode
        });
        if (memcode == "") {
            app.onLogout();
        }
    },
    /* 点击减号 */
    bindMinus: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var type = this.data.fliterSelected;
        var dataList = [];
        var dataTotal = 0;
        switch (type) {
            case 0:
                dataList = that.data.presellList;
                dataTotal = that.data.presellTotal;
                break;
            case 1:
                dataList = that.data.saleList;
                dataTotal = that.data.saleTotal;
                break;
        }
        var num = dataList[index].Ordercount;
        // 如果大于1时，才可以减
        if (num > 1) {
            num--;
            if (dataList[index].selected) {
                dataTotal -= dataList[index].Orderprice;
            }
        }
        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num < 1 ? 'disabled' : 'normal';


        dataList[index].Ordercount = num;
        dataList[index].MinusStatus = minusStatus;


        // 将数值与状态写回
        if (type == 0) {
            that.setData({
                presellList: dataList,
                presellTotal: dataTotal,
                dataTotal: dataTotal
            })
        } else if (type == 1) {
            that.setData({
                saleList: dataList,
                saleTotal: dataTotal,
                dataTotal: dataTotal
            })
        }
    },
    /* 点击加号 */
    bindPlus: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var type = this.data.fliterSelected;
        var dataList = [];
        var dataTotal = 0;
        switch (type) {
            case 0:
                dataList = that.data.presellList;
                dataTotal = that.data.presellTotal;
                break;
            case 1:
                dataList = that.data.saleList;
                dataTotal = that.data.saleTotal;
                break;
        }
        var itemTotal = dataList[index].Orderprice * dataList[index].Ordercount;
        var stock = dataList[index].Stock;
        var num = dataList[index].Ordercount;

        // 不作过多考虑自增1
        num++;
        if (dataList[index].selected) {
            dataTotal += dataList[index].Orderprice;
        }

        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num < 1 ? 'disabled' : 'normal';
        // 将数值与状态写回

        dataList[index].Ordercount = num;
        dataList[index].MinusStatus = minusStatus;
        if (num > stock) {
            wx.showToast({
                title: '最大库存为:' + stock,
                icon: "none"
            })
            dataList[index].Ordercount = stock;
            if (dataList[index].selected) {
                dataTotal -= dataList[index].Orderprice;
            }
        }

        if (type == 0) {
            that.setData({
                presellList: dataList,
                presellTotal: dataTotal,
                dataTotal: dataTotal
            })
        } else if (type == 1) {
            that.setData({
                saleList: dataList,
                saleTotal: dataTotal,
                dataTotal: dataTotal
            })
        }
    },
    /* 输入框事件 */
    bindManual: function(e) {
        var that = this;
        var num = parseInt(e.detail.value);
        var index = e.currentTarget.dataset.index;
        var type = this.data.fliterSelected;
        var dataList = [];
        var dataTotal = 0;
        switch (type) {
            case 0:
                dataList = that.data.presellList;
                dataTotal = that.data.presellTotal;
                break;
            case 1:
                dataList = that.data.saleList;
                dataTotal = that.data.saleTotal;
                break;
        }
        var itemTotal_ = dataList[index].Orderprice * dataList[index].Ordercount;

        // 只有大于一件的时候，才能normal状态，否则disable状态
        var minusStatus = num < 1 ? 'disabled' : 'normal';
        // 将数值与状态写回

        dataList[index].Ordercount = num;
        dataList[index].MinusStatus = minusStatus;

        var stock = dataList[index].Stock;
        if (num > stock) {
            wx.showToast({
                title: '最大库存为:' + stock,
                icon: "none"
            })
            dataList[index].Ordercount = stock;
        }
        var itemTotal = dataList[index].Orderprice * dataList[index].Ordercount;
        if (dataList[index].selected) {
            dataTotal -= itemTotal_;
            dataTotal += itemTotal;
        }

        if (type == 0) {
            that.setData({
                presellList: dataList,
                presellTotal: dataTotal,
                dataTotal: dataTotal
            })
        } else if (type == 1) {
            that.setData({
                saleList: dataList,
                saleTotal: dataTotal,
                dataTotal: dataTotal
            })
        }
    },
    addSelect: function(e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var type = this.data.fliterSelected;
        var dataList = [];
        var dataTotal = 0;
        switch (type) {
            case 0:
                dataList = that.data.presellList;
                dataTotal = that.data.presellTotal;
                break;
            case 1:
                dataList = that.data.saleList;
                dataTotal = that.data.saleTotal;
                break;
        }
        var selected = dataList[index].selected;
        var itemTotal = dataList[index].Orderprice * dataList[index].Ordercount;
        if (!selected) {
            dataList[index].selected = true;
            dataTotal += itemTotal;
        } else {
            dataList[index].selected = false;
            dataTotal -= itemTotal;
        }

        if (type == 0) {
            that.setData({
                presellList: dataList,
                presellTotal: dataTotal,
                dataTotal: dataTotal
            })
        } else if (type == 1) {
            that.setData({
                saleList: dataList,
                saleTotal: dataTotal,
                dataTotal: dataTotal
            })
        }
    },
    bindSelectAll: function() {
        var that = this;
        var type = that.data.fliterSelected;

        var dataTotal = 0;
        var dataList = [];
        var selectAll = false;

        switch (type) {
            case 0:
                dataList = that.data.presellList;
                dataTotal = that.data.presellTotal;
                selectAll = that.data.presellSelectAll;
                break;
            case 1:
                dataList = that.data.saleList;
                dataTotal = that.data.saleTotal;
                selectAll = that.data.saleSelectAll;
                break;
        }
        selectAll = !selectAll;
        for (var i = 0; i < dataList.length; i++) {
            dataList[i].selected = selectAll;
            var itemTotal = dataList[i].Orderprice * dataList[i].Ordercount;
            if (selectAll) {
                dataTotal += itemTotal;
            } else {
                dataTotal = 0;
            }
        }

        if (type == 0) {
            that.setData({
                presellList: dataList,
                presellTotal: dataTotal,
                dataTotal: dataTotal,
                presellSelectAll: selectAll,
                selectAll: selectAll,
            })
        } else if (type == 1) {
            that.setData({
                saleList: dataList,
                saleTotal: dataTotal,
                dataTotal: dataTotal,
                saleSelectAll: selectAll,
                selectAll: selectAll,
            })
        }
    },
    deleteCartItem: function(id) {
        app.showLoading();
        var that = this;
        var url = app.globalData.appUrl + "/Shoppingcart/DelItem";
        var data = {
            id: id
        }
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "POST",
            success(data) {
                wx.hideLoading();
                console.log(data);
                if (data.IsSuccess == 0) {
                    wx.showToast({
                        title: data.Message,
                        icon: "none"
                    })
                    return;
                }
            }
        })
    },
    bindConfirmOrder: function() {
        var that = this;
        var type = that.data.fliterSelected;
        var cartList = [];
        var dataList = [];

        switch (type) {
            case 0:
                dataList = that.data.presellList;
                break;
            case 1:
                dataList = that.data.saleList;
                break;
        }

        for (var i = 0; i < dataList.length; i++) {
            var id = dataList[i].Id;
            var num = dataList[i].Ordercount;
            if (dataList[i].selected) {
                cartList.push(id + "_" + num);
            }
        }
        if (cartList.length == 0) {
            wx.showToast({
                title: '请至少选择一个产品进行结算',
                icon: 'none'
            })
            return;
        }
        wx.setStorageSync("cart", cartList.join(','));
        wx.navigateTo({
            url: '../../pages/order-confirm/order-confirm',
        })
    },
    getShoppingList: function() {
        app.showLoading();
        var that = this;
        var url = app.globalData.appUrl + "/Shoppingcart/GetShoppingcartList";
        wx.request({
            url: url,
            data: {
                Orderuser: that.data.memcode
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: "GET",
            success(res) {
                wx.hideLoading();
                console.log(res);
                that.setData({
                    presellList: res.data.PresellList,
                    saleList: res.data.SaleList
                })
            }
        })
    }
})