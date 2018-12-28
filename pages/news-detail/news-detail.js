const app = getApp();

// pages/news-detail/news-detail.js
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
		console.log(options);
		var id = parseInt(options.id);
		var title = "最新消息"
		this.setData({
			id: id,
			title: title
		});
        this.getInformationList(); 
	},
	/**
	 * 获取资讯列表
	 */
	getInformationList: function() {
		var that = this;
		wx.showLoading({
			title: '加载中，请稍候...'
		})
		wx.request({
			url: app.globalData.appUrl + '/Information/GetInformationList',
			data: {
				pageSize: 1,
				Id: that.data.id
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				var data = res.data;
				console.log(data);
				that.setData({
					news: data.Rows[0]
				})
				wx.setNavigationBarTitle({
					title: that.data.news.Title,
				});
				wx.hideLoading();
			}
		})
	},
})
