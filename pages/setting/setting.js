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
                id: 'order-inquiry',
                name: '订单查询',
                param: '',
                isTab: false
            }, {
                id: 'bill-inquiry',
                name: '账单查询',
                param: '',
                isTab: false
            }, {
                id: 'delivery-query',
                name: '发货查询',
                param: '',
                isTab: false
            }, {
                id: 'password-revise',
                name: '修改密码',
                param: '',
                isTab: false
            }, {
                id: 'complaint',
                name: '投诉建议',
                param: '',
                isTab: false
            }, {
                id: 'comments-list',
                name: '查看留言',
                param: '',
                isTab: false
            }, {
                id: 'news-list',
                name: '物流信息',
                param: '?t=2',
                isTab: false
            }, {
                id: 'news-list',
                name: '最新信息',
                param: '?t=1',
                isTab: false
            }, {
                id: 'news-list',
                name: '常见问题',
                param: '?t=3',
                isTab: false
            }, {
                id: 'address-list',
                name: '收货地址',
                param: '',
                isTab: false
            }, {
                id: 'share',
                name: '分享推荐',
                param: '',
                isTab: false
            }, {
                id: 'order-agent',
                name: '产品代购',
                param: '',
                isTab: false
            }]
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (!app.checkLogin()) {
            return false;
        }
        var that = this;
        var member = this.data.member;
        var memcode = this.data.memcode;
        wx.getStorage({
            key: 'memcode',
            success: function(res) {
                var memcode = res.data;
                console.log('memcode:' + memcode);
                that.setData({
                    memcode: memcode
                });
                that.getMemberByCode();
            },
            fail: function(res) {
                that.onLogout();
            }
        })
    },

    /**
     * 用户点击退出登录
     */
    onLogout: function() {
        app.onLogout();
    },
    toMemberInfo: function() {
        wx.navigateTo({
            url: '../../pages/member-info/member-info'
        })
    },
    toNavigate: function(even) {
        console.log(even);
        var data = even.currentTarget.dataset;
        var url = data.url;
        var isTab = data.tab;
        var param = data.param;
        console.log(data);
        if (isTab) {
            wx.switchTab({
                url: url + param,
            })
        } else {
            wx.navigateTo({
                url: url + param,
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