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
    productList: [], //产品列表
    // brand: null,
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
      index: 0,
      title: "排序方式",
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
      index: 1,
      title: "预售",
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
      index: 1,
      title: "现售",
      item: [{
        title: "现售",
        value: 3,
        selected: false
      }, {
        title: "现售竞购",
        value: 4,
        selected: false
      }, {
        title: "预订",
        value: 5,
        selected: false
      }]
    }, {
      index: 2,
      title: "颜色",
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
      index: 3,
      title: "是否竞价",
      item: [{
        title: "有低价",
        value: "1",
        selected: false
      }, {
        title: "无底价",
        value: "2",
        selected: false
      }, {
        title: "不竞购",
        value: "3",
        selected: false
      }]
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
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
  toBuyNow(even) {
    wx.showToast({
      title: '购买',
      icon: 'none'
    })
    console.log(even);
  },
  doSearch: function(even) {
    console.log(even);
    var value = even.detail.value;
    this.setData({
      searchValue: value,
      productList: [],
      page: 1
    })
    this.getListByCode();
  },

  /**
   * 获取产品列表_Code
   */
  getListByCode: function() {
    var _that = this;
    var page = _that.data.page;
    var pageSize = _that.data.pageSize;
    var kw = _that.data.searchValue;
    wx.request({
      url: app.globalData.appUrl + '/Product/GetListByCode',
      data: {
        page: page,
        pageSize: pageSize,
        productName: kw ? kw : ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        var total = res.data.Total;
        console.log(total);
        if (total == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
          })
        }
        var productList = res.data.Rows;
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
      }
    })
  }
})