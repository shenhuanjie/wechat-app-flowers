var app = getApp();
// pages/setting/setting.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        memcode: null,
        member: null,
        login: "登录",
        topmemcode: "请登录",
        lblAccount: "--",
        list: [{
            id: 'view',
            name: '视图容器',
            open: false,
            pages: [{
                id: 'orders',
                name: '订单查询',
                isTab: true
            }, {
                id: 'view',
                name: '账单查询',
                isTab: false
            }, {
                id: 'view',
                name: '发货查询',
                isTab: false
            }, {
                id: 'password-revise',
                name: '修改密码',
                isTab: false
            }, {
                id: 'complaint',
                name: '投诉建议',
                isTab: false
            }, {
                id: 'comments',
                name: '提交留言',
                isTab: false
            }, {
                id: 'logistics',
                name: '物流信息',
                isTab: false
            }, {
                id: 'view',
                name: '最新信息',
                isTab: false
            }]
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var _that = this;
        var member = this.data.member;
        var memcode = this.data.memcode;
        wx.getStorage({
            key: 'memcode',
            success: function(res) {
                var memcode = res.data;
                console.log('memcode:' + memcode);
                _that.setData({
                    memcode: memcode
                });
                _that.getMemberByCode();
            },
            fail: function(res) {
                _that.onLogout();
            }
        })
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
     * 用户点击退出登录
     */
    onLogout: function() {
        wx.clearStorage();
        wx.navigateTo({
            url: '../../pages/login/login'
        })
    },
    toMemberInfo: function() {
        wx.navigateTo({
            url: '../../pages/member-info/member-info'
        })
    },
    toNavigate: function(even) {
        console.log(even);
        var data=even.currentTarget.dataset;
        var url=data.url;
        var isTab=data.tab;
        console.log(data);
        if(isTab){
            wx.switchTab({
                url: url,
            })
        }else{
            wx.navigateTo({
                url: url,
            })
        }
    },
    getMemberByCode: function() {
        var _that = this;
        var memcode = _that.data.memcode;
        wx.request({
            url: app.globalData.appUrl + '/Member/GetMemberByCode',
            data: {
                memcode: memcode
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data)
                var member = res.data.Member;
                if (member && member.Id > 0) {
                    var memcode = member.Code;
                    var memName = member.Name;
                    var memMonetary = member.Monetary.toFixed(2);
                    _that.setData({
                        member: member,
                        memcode: memcode,
                        topmemcode: memName,
                        lblAccount: memMonetary,
                        login: "退出登录"
                    })
                    wx.setStorage({
                        key: 'memName',
                        data: memName,
                    })
                } else {
                    _that.onLogout();
                }
            }
        })
    }
})