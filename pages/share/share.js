var QRCode = require('../../utils/weapp-qrcode.js');
var qrcode;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        memcode: wx.getStorageSync("memcode"),
        memName: wx.getStorageSync("memName")
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.initQRCode();

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
     * 初始化二维码
     */
    initQRCode: function() {
        var that = this;
        console.log(that);
        qrcode = new QRCode('canvas', {
            text: that.data.memcode,
            width: 200,
            height: 200,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
        });
    },
    tapHandler: function(e) {
        qrcode.makeCode(e.target.dataset.code); //用元素对应的code更新二维码
    }
})