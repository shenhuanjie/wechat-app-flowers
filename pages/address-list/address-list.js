const app = getApp();
// pages/address-list/address-list.js
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
        this.getReceivingaddressList();
    },
    onShow: function() {
        this.getReceivingaddressList();
    },
    /**
     * 设为默认
     */
    starAddressModal: function(even) {
        var id = even.currentTarget.dataset.id;
        var that = this;
        var id = even.currentTarget.dataset.id;
        wx.showModal({
            title: '温馨提示',
            content: '确认要设置该地址为默认地址吗？',
            showCancel: true, //是否显示取消按钮
            cancelText: "否", //默认是“取消”
            confirmText: "是", //默认是“确定”
            success: function(res) {
                console.log(res)
                if (res.confirm) {
                    that.starAddress(id);
                }
            }
        });
    },
    starAddress: function(id) {
        var that = this;
        wx.showLoading({
            title: '加载中，请稍候...'
        });
        wx.request({
            url: app.globalData.appUrl + '/Receivingaddress/SetDefault',
            data: {
                code: wx.getStorageSync('memcode'),
                id: id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                console.log(data);
                that.getReceivingaddressList();
                wx.hideLoading();
            }
        })
    },
    /**
     * 删除地址
     */
    trashAddressModal: function(even) {
        var that = this;
        var id = even.currentTarget.dataset.id;
        wx.showModal({
            title: '温馨提示',
            content: '确认要删除该地址吗？',
            showCancel: true, //是否显示取消按钮
            cancelText: "否", //默认是“取消”
            confirmText: "是", //默认是“确定”
            success: function(res) {
                console.log(res)
                if (res.confirm) {
                    that.trashAddress(id);
                }
            }
        });
    },
    trashAddress: function(id) {
        var that = this;
        wx.showLoading({
            title: '加载中，请稍候...'
        });
        wx.request({
            url: app.globalData.appUrl + '/Receivingaddress/DelItem',
            data: {
                id: id
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                console.log(data);
                that.getReceivingaddressList();
                wx.hideLoading();
            }
        })
    },
    /**
     * 获取地址列表
     */
    getReceivingaddressList: function() {
        var that = this;
        wx.showLoading({
            title: '加载中，请稍候...'
        });
        wx.request({
            url: app.globalData.appUrl + '/Receivingaddress/GetReceivingaddressList',
            data: {
                Orderuser: wx.getStorageSync('memcode')
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                console.log(data);
                that.setData({
                    dataList: data.Rows,
                    total: data.Total
                })
                wx.hideLoading();
            }
        })
    },
    /**
     * 跳转到新增地址
     */
    toAddAddress: function(even) {
        var that = this;
        wx.navigateTo({
            url: '../../pages/address-add/address-add',
        })
    }
})