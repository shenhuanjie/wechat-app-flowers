var app = getApp();
// pages/products/products.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		imgPrefix: app.globalData.imgPrefix,
		page: 1, //分页
		pageSize: 20, //分页大小
		sortType: 0,
		market: '缤纷总网', //站点
		brand: "", //品牌
		searchType: 0, //0-全部；1-有底价；2-无底价；3-不竞购
		bigType: [], //大类
		smallType: [], //小类
		buyWay: 1, //购买方式：1-预售现售；2-预售竞购；3-预售预订；4-现售；5-现售竞购；6-预订
		color: [], //颜色
		saleDate: app.formatDate((new Date()), "yyyy-MM-dd"),
		productList: [], //产品列表
		isHideLoadMore: false,
		searchValue: null,
		iconlist: "icon-list",
		searchFilterPop: false, //显示弹出层
		// 筛选项目
		selectIndex: -1,
		searchFilterList: [{
			index: 0,
			title: "排序",
			icon: "icon-down",
			selected: false,
		}, {
			index: 1,
			title: "购买方式",
			icon: "icon-down",
			selected: false
		}, {
			index: 2,
			title: "颜色",
			icon: "icon-down",
			selected: false
		}, {
			index: 3,
			title: "是否竞价",
			icon: "icon-down",
			selected: false
		}, {
			index: 4,
			title: "筛选",
			icon: "icon-filter icon-big",
			selected: false
		}],
		searchFilterItemList: [{
			group: 0,
			title: "排序方式",
			single: true,
			defult: 0,
			item: [{
				title: "默认",
				value: 0,
				selected: true
			}, {
				title: "按销量（高->低）",
				value: 1,
				selected: false
			}, {
				title: "按销量（低->高）",
				value: 2,
				selected: false
			}, {
				title: "按价格（低->高）",
				value: 3,
				selected: false
			}, {
				title: "按价格（低->高）",
				value: 4,
				selected: false
			}]
		}, {
			group: 1,
			title: "预售",
			single: true,
			defult: 1,
			item: [{
				title: "预售现售",
				value: 1,
				selected: true
			}, {
				title: "预售竞购",
				value: 2,
				selected: false
			}, {
				title: "预售预订",
				value: 3,
				selected: false
			}]
		}, {
			group: 1,
			title: "现售",
			single: true,
			defult: 1,
			item: [{
				title: "现售",
				value: 4,
				selected: false
			}, {
				title: "现售竞购",
				value: 5,
				selected: false
			}, {
				title: "预订",
				value: 6,
				selected: false
			}]
		}, {
			group: 2,
			title: "颜色",
			single: true,
			defult: 0,
			item: [{
				title: "白色",
				value: "白色",
				selected: false
			}, {
				title: "黄色",
				value: "黄色",
				selected: false
			}, {
				title: "绿色",
				value: "绿色",
				selected: false
			}, {
				title: "粉色",
				value: "粉色",
				selected: false
			}, {
				title: "玫红色",
				value: "玫红色",
				selected: false
			}, {
				title: "红色",
				value: "红色",
				selected: false
			}, {
				title: "浅绿色",
				value: "浅绿色",
				selected: false
			}, {
				title: "混色",
				value: "混色",
				selected: false
			}]
		}, {
			group: 3,
			title: "是否竞价",
			single: true,
			defult: 0,
			item: [{
				title: "有低价",
				value: 1,
				selected: false
			}, {
				title: "无底价",
				value: 2,
				selected: false
			}, {
				title: "不竞购",
				value: 3,
				selected: false
			}]
		}]
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function(options) {
		var market = wx.getStorageSync('market');
		var brand = wx.getStorageSync('brand');
		this.setData({
			market: market,
			brand: brand,
			// brand: options.brand,
			// searchValue: options.brand,
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {
		this.getListByCode();
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
	onPullDownRefresh() {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {
		console.log('加载更多');
		this.setData({
			isHideLoadMore: true,
		})
		this.getListByCode();
	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	toggleItemList: function() {
		var iconlist = this.data.iconlist;
		if (iconlist == "icon-list") {
			this.setData({
				iconlist: "icon-list-item"
			})
		} else {
			this.setData({
				iconlist: "icon-list"
			})
		}
	},
	// 点击筛选分类
	onSelectFilterPop: function(e) {
		var selectIndex = e.currentTarget.dataset.index;
		var preIndex = this.data.selectIndex;
		var searchFilterList = this.data.searchFilterList;

		if (selectIndex == preIndex) {
			searchFilterList[preIndex].selected = false;
			this.setData({
				searchFilterPop: false,
				selectIndex: -1,
				searchFilterList: searchFilterList
			})
		} else {
			if (preIndex != -1) {
				searchFilterList[preIndex].selected = false;
			}
			searchFilterList[selectIndex].selected = true;
			console.log("selectIndex：" + selectIndex);

			this.setData({
				searchFilterPop: true,
				selectIndex: selectIndex,
				searchFilterList: searchFilterList
			})
		}
	},
	onSelectFilterHide: function() {
		console.log("onSelectFilterHide:");
		var preIndex = this.data.selectIndex;
		var searchFilterList = this.data.searchFilterList;
		if (preIndex != -1) {
			searchFilterList[preIndex].selected = false;
		}
		this.setData({
			searchFilterPop: false,
			selectIndex: -1,
			searchFilterList: searchFilterList
		})
	},
	/**
	 * 添加关注
	 */
	addFollow(even) {
		wx.showToast({
			title: '添加关注',
			icon: 'none'
		})
		console.log(even);
	},
	/**
	 * 跳转商品详情
	 */
	toProduct: function(even) {
		console.log(even);
		var productId = even.currentTarget.dataset.id;
		wx.navigateTo({
			url: '../../pages/product/product?productId=' + productId,
		})
	},
	/**
	 * 购买
	 */
	toBuyNow: function(even) {
		wx.showToast({
			title: '购买',
			icon: 'none'
		})
		console.log(even);
	},
	toFavorite: function(even) {
		console.log(even);
		wx.navigateTo({
			url: '../../pages/favorite/favorite',
		})
	},
	toCart: function(even) {
		console.log(even);
		wx.navigateTo({
			url: '../../pages/cart/cart',
		})
	},
	toCart: function(even) {
		console.log(even);
		wx.navigateTo({
			url: '../../pages/cart/cart',
		})
	},
	toCategory: function(even) {
		console.log(even);
		wx.navigateTo({
			url: '../../pages/category/category',
		})
	},
	changeSearch: function(even) {
		console.log(even);
		var value = even.detail.value;
		this.setData({
			searchValue: value,
		})
		this.doSearch();
	},
	/**
	 * 单选条件
	 */
	selectFilterItem: function(even) {
		var data = even.currentTarget.dataset;
		console.log(data);
		var index = data.index;
		var subindex = data.subindex;
		var value = data.value;

		var itemList = this.data.searchFilterItemList;
		var single = itemList[index].single;
		var group = itemList[index].group;
		if (single) {
			for (var i = 0; i < itemList[index].item.length; i++) {
				if (itemList[index].item[i].selected && i != subindex) {
					itemList[index].item[i].selected = false;
				}
			}
		}
		for (var i = 0; i < itemList.length; i++) {
			if (i != index && itemList[i].group == group) {
				for (var k = 0; k < itemList[i].item.length; k++) {
					itemList[i].item[k].selected = false;
				}
			}
		}

		itemList[index].item[subindex].selected = !itemList[index].item[subindex].selected;

		var buyWay = this.data.buyWay;
		var color = this.data.color;
		var searchType = this.data.searchType;
		switch (group) {
			case 1:
				buyWay = value;
				break;
			case 2:
				color = [value];
				break;
			case 3:
				searchType = value;
				break;
		}
		console.log("buyWay:" + buyWay);
		console.log("color:" + color);
		console.log("searchType:" + searchType);

		this.setData({
			searchFilterItemList: itemList,
			buyWay: buyWay,
			color: color,
			searchType: searchType

		})
	},
	/**
	 * 多选条件
	 */
	selectMultFilterItem: function(even) {
		var data = even.currentTarget.dataset;
		console.log(data);
		var index = data.index;
		var subindex = data.subindex;
		var value = data.value;
	},
	resetSearch: function() {
		var itemList = this.data.searchFilterItemList;
		for (var i = 0; i < itemList.length; i++) {
			var defult = itemList[i].defult;
			console.log(defult);
			for (var k = 0; k < itemList[i].item.length; k++) {
				var value = itemList[i].item[k].value;
				console.log("i:" + i + ",k:" + k + ",defult:" + defult + ",value:" + value);
				if (value == defult) {
					itemList[i].item[k].selected = true;
				} else {
					itemList[i].item[k].selected = false;
				}
			}
		}
		this.setData({
			searchFilterItemList: itemList,
			searchValue: '',
			sore: 0,
			buyWay: 1,
			color: [],
			searchType: 1,
			page: 1
		})
		this.onSelectFilterHide();
		this.getListByCode();
	},
	doSearch: function() {
		var searchValue = this.data.searchValue
		this.setData({
			searchValue: searchValue ? searchValue : '',
			productList: [],
			page: 1
		})
		this.getListByCode();
		this.onSelectFilterHide();
	},

	/**
	 * 获取产品列表_Code
	 */
	getListByCode: function() {
		var _that = this;
		var page = _that.data.page;
		var pageSize = _that.data.pageSize;
		var kw = _that.data.searchValue;
		var buyWay = _that.data.buyWay;
		var bigType = _that.data.bigType;
		var smallType = _that.data.smallType;
		var market = _that.data.market;
		var color = _that.data.color;
		var brand = _that.data.brand;
		var searchType = _that.data.searchType;
		var saleDate = _that.data.saleDate;

		var url = app.globalData.appUrl + "/Product/GetListByCode";
		if (buyWay == 3 || buyWay == 6) {;
			url = app.globalData.appUrl + "/Product/GetBookListByCode";
		}
		wx.showLoading({
			title: "加载中，请稍候..."
		})
		wx.request({
			url: url,
			data: {
				// ptype: bigType.join(','),
				// pclass: smallType.join(','),
				page: page,
				pageSize: 20,
				site: market,
				color: color.join(','),
				// brand: brand,
				searchType: searchType,
				buyWay: buyWay,
				saleDate: saleDate,
				productName: kw ? kw : ''
			},
			header: {
				'content-type': 'application/json' // 默认值
			},
			success(res) {
				wx.hideLoading();
				console.log(res.data)
				var total = res.data.Total;
				console.log(total);
				if (page == 1 && total == 0) {
					wx.showToast({
						title: '暂无产品哦，或者你可以换个条件再查查？',
						icon: 'none'
					})
				} else if (total == 0) {
					wx.showToast({
						title: '没有更多了',
						icon: 'none'
					})
				}
				var productList = res.data.Rows;
				if (buyWay == 3 || buyWay == 6) {
					for (var i = 0; i < productList.length; i++) {
						productList[i].Price = productList[i].Averprice;
					}
				}
				var list = _that.data.productList;
				if (page > 1) {
					productList = list.concat(productList);
				}
				page++;
				_that.setData({
					"productList": productList,
					"page": page,
					isHideLoadMore: false,
				})
				wx.setStorage({
					key: 'buyWay',
					data: buyWay,
				})
			}
		})
	}
});
