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
        sclause: "本产品可享受指定日期发货服务，请在订单中确认。",
        stip: "仅限联邦快递24小时可达地区，为方便物流的跟踪，请务必填写收件地址的正确邮编，以免造成投递失败。",
        saleDate: app.formatDate((new Date()), "yyyy-MM-dd"),
        product: {},
        showPop: false,
        isNullProduct: false,
        buycount: 1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        this.initView(options);
        this.getVProduct();
    },
    initView: function(options) {
        var that = this;

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
        if (!app.checkLogin()) {
            return false;
        }
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
    //加入购物车:0?立即购买:1
    addToCart: function(isConfirm) {
        if (!app.checkLogin()) {
            return false;
        }
        wx.showLoading({
            title: '正在努力加载中……',
        })
        var that = this;
        var url = app.globalData.appUrl + "/Shoppingcart/AddOrUpdate";
        var currentProduct = that.data.product;
        var num = that.data.buycount;
        var memCode = wx.getStorageSync("memcode");
        var memName = wx.getStorageSync("memName");
        var buyWay = wx.getStorageSync("buyWay");
        // var isConfirm = that.data.submitType.type;
        var data = {
            Ssite: currentProduct.Ssite,
            Code: currentProduct.Code,
            Name: currentProduct.Name,
            Grade: currentProduct.Grade,
            Brand: currentProduct.Brand,
            Brandcode: currentProduct.Brandcode,
            Color: currentProduct.Color,
            Lclass: currentProduct.Lclass,
            Sclass: currentProduct.Sclass,
            Ordercount: num,
            Allcount: num,
            Orderprice: currentProduct.Price,
            Orderuser: memCode,
            Ordername: memName,
            Picpath: currentProduct.Picpath,
            Ordertype: buyWay,
            Isvir: currentProduct.Isvir,
            Salesman: memCode,
            isConfirm: isConfirm
        }
        console.log(data);
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                that.setData({
                    showPop: false
                });
                var msg = res.data.Msg;
                wx.hideLoading();
                wx.showToast({
                    title: msg,
                    icon: 'none'
                })
            }
        })
    },
    //初始化等级
    getSaleGrade: function() {
        var that = this;
        var url = app.globalData.appUrl + "/Product/GetSaleGrade";
        var data = {
            code: that.data.code,
            brand: that.data.brandList[that.data.brandIndex],
        }
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data);
                var total = res.data.Total;
                var dataList = res.data.Rows;
                that.setData({
                    gradeList: dataList,
                    gradeIndex: 0,
                });
                if (that.data.codeType == 0) {
                    that.getProductDetail();
                } else {
                    that.setData({
                        gradeList: [{
                            Grade: that.data.product.Grade
                        }],
                        gradeIndex: 0,
                    });
                }
            }
        })
    },
    getVProduct: function() {
        var that = this;
        var codeType = this.data.code;
        //基础产品数据接口
        var url = app.globalData.appUrl + "/Product/GetVProduct";
        var data = {
            site: this.data.market,
            code: this.data.code,
            saleDate: this.data.saleDate,
            buyWay: this.data.buyWay
        }
        console.log(data);
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
        console.log(data);
        app.request(url, data, function(res) {
            console.log(res.data.VProduct);
            var product = res.data.VProduct;
            var vproduct = res.data.VProduct;
            if (codeType == 0) {
                vproduct.Price = vproduct.Miprice + "~" + vproduct.Maprice;
                vproduct.Picpath = vproduct.Piclist.split(',')[0];
                that.setData({
                    brandList: product.Brand.substr(0, product.Brand.length - 1).split(","),
                    brandIndex: 0,
                    ssite: product.Ssite,
                    name: product.Name,
                    product: product,
                    vproduct: vproduct,
                    codeType: codeType
                })
            } else {
                that.setData({
                    brandList: product.Brand.split(","),
                    brandIndex: 0,
                    ssite: product.Ssite,
                    name: product.Name,
                    product: product,
                    vproduct: vproduct,
                    codeType: codeType
                })
            }
            that.getSaleGrade();
            wx.setNavigationBarTitle({
                title: product.Name
            })
        })
    },
    /**
     * 获取当前产品信息
     */
    getProductDetail: function() {
        var that = this;
        //基础产品数据接口
        var url = app.globalData.appUrl + "/Product/GetProductDetail";
        var product = that.data.product;
        var data = {
            site: that.data.ssite,
            code: that.data.code,
            saleDate: that.data.saleDate,
            buyWay: wx.getStorageSync("buyWay"),
            brand: that.data.brandList[that.data.brandIndex],
            grade: that.data.gradeList[that.data.gradeIndex].Grade,
            name: that.data.name,
        }
        console.log(data);
        wx.request({
            url: url,
            data: data,
            header: {
                'content-type': 'application/json' // 默认值
            },
            success(res) {
                console.log(res.data);
                that.setData({
                    product: res.data.VProduct,
                    isNullProduct: false
                })
                if (res.data.VProduct == null) {
                    that.setData({
                        isNullProduct: true
                    })
                    wx.showToast({
                        title: '当前类别暂无信息',
                        icon: 'none'
                    })
                }


            }
        })

    },
    bindGradeSelect: function(e) {
        this.setData({
            gradeIndex: e.currentTarget.dataset.index,
            buycount: 1
        })
        this.getProductDetail();
    },
    bindBtnSubmit: function() {
        if (this.data.isNullProduct) {
            wx.showToast({
                title: '请选择有效项目',
                icon: 'none'
            })
            return 0;
        }
        var submitType = this.data.submitType.type;
        if (submitType == 0) {
            this.addToCart(0);
        } else if (submitType == 1) {
            this.addToCart(1);
        }
    },

    bindAddCart: function() {
        this.bindHidePop();
        this.setData({
            submitType: {
                type: 0,
                title: "addCart"
            }
        })
    },

    bindBuyNow: function() {
        this.bindHidePop();
        this.setData({
            submitType: {
                type: 1,
                title: "buyNow"
            }
        })
    },
    bindHidePop: function() {
        this.setData({
            showPop: !this.data.showPop
        })
    },
    bindDateChange: function(e) {
        this.setData({
            brandIndex: e.detail.value,
        })
        this.getSaleGrade();
    },
    bindMinus: function(e) {
        var num = this.data.buycount;
        // 如果大于1时，才可以减
        if (num > 1) {
            num--;
        } else {
            wx.showToast({
                title: '购买数量不能为0',
                icon: 'none'
            })
        }
        this.setData({
            buycount: num
        })
    },
    bindManual: function(e) {
        var num = parseInt(e.detail.value);
        if (num > this.data.product.Timelycount) {
            wx.showToast({
                title: '购买数量不能大于库存',
                icon: 'none'
            })
            num = this.data.product.Timelycount;
        } else if (num < 1) {
            wx.showToast({
                title: '购买数量不能为0',
                icon: 'none'
            })
            num = 1;
        }
    },
    bindPlus: function(e) {
        var num = this.data.buycount;
        num++;
        if (num > this.data.product.Timelycount) {
            wx.showToast({
                title: '购买数量不能大于库存',
                icon: 'none'
            })
            num = this.data.product.Timelycount;
        }
        this.setData({
            buycount: num
        })
    }
})