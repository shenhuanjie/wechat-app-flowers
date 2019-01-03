// pages/address-add/address-add.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: ['请选择地区', '', ''],
        fontColorGray: "font-color-gray",
        memCode: wx.getStorageSync('memcode'),
        memName: wx.getStorageSync("memName"),
        isDefault: false,
        phone: '',
        areaId: '',
        province: '',
        city: '',
        area: '',
        address: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

    },
    /**
     * 输入框绑定
     */
    bindPhone: function(event) {
        this.setData({
            phone: event.detail.value
        });
    },
    bindAddress: function(event) {
        this.setData({
            address: event.detail.value
        });
    },
    bindRegionChange: function(e) {
        console.log(e);
        console.log('picker发送选择改变，携带值为', e.detail.value);
        this.setData({
            fontColorGray: "",
            region: e.detail.value,
            areaId: e.detail.code[2],
            province: e.detail.value[0],
            city: e.detail.value[1],
            area: e.detail.value[2],
        })
    },
    /**
     * 设置勾选
     */
    switchIsDefault: function() {
        this.setData({
            isDefault: !this.data.isDefault
        })
    },
    saveAddress: function(even) {
        var that = this;

        var phone = that.data.phone;
        var areaId = that.data.areaId;
        var address = that.data.address;

        var checkFlat = true;
        var errorMsg = "";

        if (phone == "") {
            errorMsg = "请填写手机号码";
            checkFlat = false;
        } else if (areaId == "") {
            errorMsg = "请选择地区";
            checkFlat = false;
        } else if (address == "") {
            errorMsg = "请请填写详细地址";
            checkFlat = false;
        }

        if (!checkFlat) {
            wx.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 2000
            })
            return false;
        }

        console.log(that.data.isDefault ? 1 : 0);
        wx.request({
            url: app.globalData.appUrl + '/Receivingaddress/AddOrUpdate',
            data: {
                Orderuser: wx.getStorageSync("memcode"),
                Ordername: wx.getStorageSync("memName"),
                Linkman: wx.getStorageSync("memName"),
                Phone: that.data.phone,
                areaId: that.data.areaId,
                Province: that.data.province,
                City: that.data.city,
                Area: that.data.area,
                Detailedaddress: that.data.address,
                Isdefault: that.data.isDefault ? 1 : 0
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                var data = res.data;
                console.log(data);
                var msg = data.Msg;
                if (data.Success) {
                    wx.showToast({
                        title: msg,
                        icon: 'none',
                        duration: 2000
                    });
                    that.setData({
                        region: ['请选择地区', '', ''],
                        fontColorGray: "font-color-gray",
                        isDefault: false,
                        phone: '',
                        areaId: '',
                        province: '',
                        city: '',
                        area: '',
                        address: ''
                    })
                } else {
                    wx.showToast({
                        title: msg,
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        })
    }
})