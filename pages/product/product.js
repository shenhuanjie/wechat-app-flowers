var app = getApp();

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		app: app,
		productId: "",
		buyWay: 1,
		product: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		console.log(options);
		this.initView(options);
		this.getVProduct();
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
	initView: function(options) {
		var _that=this;
		var productId = options.productId;
		var buyWay = wx.getStorageSync('buyWay');
		this.setData({
			buyWay: buyWay,
			productId:productId
		})
		
	},
	getVProduct: function() {
		var _that = this;
		var productId = this.data.productId;
		if (productId == "") {
			console.log("getVProduct:Error");
			return 0;
		}

		var code = "";
		var site = "";
		var buyWay=_that.data.buyWay;
        console.log("buyWay:" + buyWay);

		var url = app.globalData.appUrl + "/Product/GetVProduct";
		var data = {
			id: productId,
			code: code,
			site: site
		}
		if (buyWay == 3 || buyWay == 6) {
			url = app.globalData.appUrl + "/Product/GetVBookProduct";
			data = {
				id: productId,
				code: code
			}
		}

		wx.request({
			url: url,
			data: data,
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				console.log(res.data.Rows);
				var product = res.data.Rows;
				if (buyWay == 3 || buyWay == 6) {
					product.Price = product.Averprice;
				}
				_that.setData({
					product: product
				})
				wx.setNavigationBarTitle({
					title: product.Name
				})
			}
		})
	}
})
