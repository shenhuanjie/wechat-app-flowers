const app = getApp();
// pages/order-agent/order-agent.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		memCode: wx.getStorageSync("memcode"),
		memName: wx.getStorageSync("memName"),
		name: "",
		orderCount: "",
		grade: "",
		require: ""
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {

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
	 * 输入框绑定
	 */
	bindName: function(event) {
		this.setData({
			name: event.detail.value
		});
	},
	bindCount: function(event) {
		this.setData({
			orderCount: event.detail.value
		});
	},
	bindGrade: function(event) {
		this.setData({
			grade: event.detail.value
		});
	},
	bindRequire: function(event) {
		this.setData({
			require: event.detail.value
		});
	},
	/**
	 * 保存产品代购
	 */
	saveOrderagent: function(even) {
		var that = this;
		var memCode = this.data.memCode;
		var memName = this.data.memName;
		var name = this.data.name;
		var orderCount = this.data.orderCount;
		var grade = this.data.grade;
		var require = this.data.require;

		var checkFlat = true;
		var errorMsg = "";

		if (name == "") {
			errorMsg = "请填写产品名称";
			checkFlat = false;
		} else if (orderCount == "") {
			errorMsg = "请填写产品数量";
			checkFlat = false;
		} else if (grade == "") {
			errorMsg = "请填写产品等级";
			checkFlat = false;
		} else if (require == "") {
			errorMsg = "请填写产品要求";
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

		wx.request({
			url: app.globalData.appUrl + '/Orderagent/AddOrUpdate',
			data: {
				Name: name,
				Grade: grade,
				Ordercount: orderCount,
				Orderuser: memCode,
				Ordername: memName,
				Allcount: orderCount,
				Require: require
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
						name: "",
						orderCount: "",
						grade: "",
						require: ""
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
