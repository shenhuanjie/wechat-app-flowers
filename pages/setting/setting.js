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
                img: 'icon_1.png',
                isTab: false
            }, {
                id: 'bill-inquiry',
                name: '账单查询',
                param: '',
                img: 'icon_2.png',
                isTab: false
            }, {
                id: 'delivery-query',
                name: '发货查询',
                param: '',
                img: 'icon_3.png',
                isTab: false
            }, {
                id: 'password-revise',
                name: '修改密码',
                param: '',
                img: 'icon_4.png',
                isTab: false
            }, {
                id: 'complaint',
                name: '投诉建议',
                param: '',
                img: 'icon_5.png',
                isTab: false
            }, {
                id: 'comments-list',
                name: '查看留言',
                param: '',
                img: 'icon_6.png',
                isTab: false
            }, {
                id: 'news-list',
                name: '物流信息',
                param: '?t=2',
                img: 'icon_7.png',
                isTab: false
            }, {
                id: 'news-list',
                name: '最新信息',
                param: '?t=1',
                img: 'icon_8.png',
                isTab: false
            }, {
                id: 'news-list',
                name: '常见问题',
                param: '?t=3',
                img: 'icon_9.png',
                isTab: false
            }, {
                id: 'address-list',
                name: '收货地址',
                param: '',
                img: 'icon_10.png',
                isTab: false
            }, {
                id: 'share',
                name: '分享推荐',
                param: '',
                img: 'icon_11.png',
                isTab: false
            }, {
                id: 'order-agent',
                name: '产品代购',
                param: '',
                img: 'icon_12.png',
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
        app.showModal("是否退出登录？", function(res) {
            console.log(res);
            if (res.confirm) {
                app.onLogout();
            }
        }, true)

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
        var that = this;
        var url = app.globalData.appUrl + '/Member/GetMemberByCode';
        var data = {
            memcode: that.data.memcode
        };
        app.request(url, data, function(res) {
            console.log(res.data)
            var member = res.data.Member;
            if (member && member.Id > 0) {
                var memcode = member.Code;
                var memName = member.Name;
                var memMonetary = member.Monetary.toFixed(2);
                that.setData({
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
                app.onLogout();
            }
        })
    }
})