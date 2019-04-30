var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        app: app,
        productId: "",
        code: "",
        memCode: "",
        follow: {
            tip: "关注",
            loveId: 0
        },
        sclause: "本产品可享受指定日期发货服务，请在订单中确认。",
        stip: "仅限联邦快递24小时可达地区，为方便物流的跟踪，请务必填写收件地址的正确邮编，以免造成投递失败。",
        saleDate: app.formatDate((new Date()), "yyyy-MM-dd"),
        sendDate: app.formatDate((new Date()), "yyyy-MM-dd"),
        product: {},
        showPop: false,
        isNullProduct: false,
        buycount: 1,

        submitType: {
            type: -1,
        },
        buttonColor: "button-green"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        console.log(options);
        this.initView(options);
    },
    initView: function(options) {

        var that = this;


        var code = options.code;
        var productId = options.id;
        var memCode = wx.getStorageSync('memcode');
        var buyWay = wx.getStorageSync('buyWay');
        var market = wx.getStorageSync("market");
        var brand = wx.getStorageSync("brand");
        var site = wx.getStorageSync("site");
        this.setData({
            buyWay: buyWay,
            memCode: memCode,
            code: code,
            productId: productId,
            market: market,
            brand: brand,
            site: site
        })

        // that.getMyLove();

        if (code) {
            that.getProduct()
        } else {
            that.getSingleProduct();
        }

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
    getMyLove: function() {
        if (!app.checkLogin()) {
            return false;
        }
        var that = this;
        var code = this.data.code;
        var productId = this.data.productId;
        var pid = productId ? productId : code;
        var memCode = this.data.memCode;

        var url = app.globalData.appUrl + "/Mylove/GetMyloveList";
        var data = {
            memCode: memCode,
            productId: pid
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
                var loveId = data.length;
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
            Grade: that.data.gradeList[that.data.gradeIndex],
            Brand: currentProduct.Brand,
            Brandcode: that.data.vproduct.Brandcode,
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
        var brand = that.data.brandList[that.data.brandIndex];
        if (brand.indexOf("《") == -1) {
            brand = "《" + brand + "》";
        }
        var data = {
            code: that.data.code,
            brand: brand,
            buyWay: that.data.buyWay,
            bBrand: that.data.brand,
            bSite: that.data.site
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
                that.getProductDetail();
            }
        })
    },
    getProduct: function() {
        var that = this;
        //基础产品数据接口
        var url = app.globalData.appUrl + "/Product/GetVProduct";
        var data = {
            site: this.data.market,
            code: this.data.code,
            saleDate: this.data.saleDate,
            buyWay: this.data.buyWay,
            bBrand: this.data.brand,
            bSite: this.data.site
        }
        console.log(data);
        app.request(url, data, function(res) {
            console.log(res.data);

            var buyWay = that.data.buyWay;

            var product = res.data.VProduct;

            //初始化品牌选择框

            var brandList = product.Brand.substr(0, product.Brand.length).split(",");

            if (buyWay == 3 || buyWay == 6) {
                product.Price = product.Averprice;
            } else {
                product.Price = product.Miprice == product.Maprice ? product.Miprice : product.Miprice + "~" + product.Maprice;
            }


            if (product.Piclist) {
                product.Picpath = product.Piclist.split(',')[0];
            }

            var vproduct = res.data.VProduct;
            that.setData({
                brandList: brandList,
                brandIndex: 0,
                ssite: product.Ssite,
                name: product.Name,
                product: product,
                vproduct: vproduct
            })
            that.getSaleGrade();
            wx.setNavigationBarTitle({
                title: product.Name
            })
        })
    },
    /**
     * 获取当前产品信息
     */
    getSingleProduct: function() {
        var that = this;
        //基础产品数据接口
        var url = app.globalData.appUrl + "/Product/GetProductDetail";
        var productId = that.data.productId;
        var data = {
            productId: productId
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
                if (data && data.VProduct) {

                    var product = data.VProduct;
                    var vproduct = res.data.VProduct;
                    var brandList = product.Brand.substr(0, product.Brand.length).split(",");


                    product.Plist = product.Packcount;
                    product.Slist = product.Slength;


                    console.log(res.data);

                    that.setData({
                        brandList: brandList,
                        brandIndex: 0,
                        gradeList: [product.Grade],
                        gradeIndex: 0,
                        ssite: product.Ssite,
                        name: product.Name,
                        product: product,
                        vproduct: vproduct
                    });
                    wx.setNavigationBarTitle({
                        title: product.Name
                    })
                }
            }
        })

    },
    getProductDetail: function() {
        var that = this;

        var url = app.globalData.appUrl + "/Product/GetProductDetail";
        var data = {
            site: this.data.market,
            code: this.data.code,
            saleDate: this.data.saleDate,
            buyWay: this.data.buyWay,
            brand: "《" + this.data.brandList[this.data.brandIndex] + "》",
            grade: this.data.gradeList[this.data.gradeIndex],
            name: this.data.product.Name
        };
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
                if (data && data.VProduct) {

                    var vproduct = data.VProduct;
                    var product = that.data.product;
                    product.Timelycount = vproduct.Timelycount;
                    product.Price = vproduct.Price;
                    product.Floorprice = vproduct.Floorprice;
                    product.Plist = vproduct.Packcount;
                    product.Slist = vproduct.Slength;
                    product.Picpath = vproduct.Picpath;
                    that.setData({
                        vproduct: vproduct,
                        product: product,
                        isNullProduct: false
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
        this.bindHidePop(0);
        this.setData({
            submitType: {
                type: 0,
                title: "addCart"
            },
            buttonColor: "#01bc72"
        });
    },

    bindBuyNow: function() {
        this.bindHidePop(1);
        this.setData({
            submitType: {
                type: 1,
                title: "buyNow"
            },
            buttonColor: "#dd4a32"
        });

    },
    bindHidePop: function(type) {
        var submitType = this.data.submitType.type;
        if (!submitType || submitType == type) {
            this.setData({
                showPop: !this.data.showPop
            })
        } else {
            this.setData({
                showPop: true
            })
        }
    },
    bindDataChange: function(e) {
        this.setData({
            brandIndex: e.detail.value,
        })
        this.getSaleGrade();
    },

    /**
     * 绑定日期选择器事件
     */
    bindDateChange: function(e) {
        var that = this;
        console.log(e);
        console.log('picker发送选择改变，携带值为', e.detail.value);
        var sendDate = e.detail.value
        that.setData({
            sendDate: sendDate
        })
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