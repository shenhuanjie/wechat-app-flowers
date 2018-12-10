var app = getApp();
// pages/products/products.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // brand: null,
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
  }
})