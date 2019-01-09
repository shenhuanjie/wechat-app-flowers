const app = getApp();
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

    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getOrderMessageList();
    },
    /**
     * 获取留言列表
     */
    getOrderMessageList: function() {
        var that = this;
        var url = app.globalData.appUrl + "/OrderMessage/GetOrdermessageList";
        var data = {
            pageSize: 100,
            Ordercode: wx.getStorageSync("memcode")
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
                console.log(data);
                for (var i = 0; i < data.Rows.length; i++) {
                    data.Rows[i].Ordertext = that.delHtmlTag(data.Rows[i].Ordertext);
                    data.Rows[i].Answertext = that.delHtmlTag(data.Rows[i].Answertext);
                }
                that.setData({
                    dataTotal: data.Total,
                    dataList: data.Rows
                })
            }
        })
    },
    bingSubmit: function() {
        wx.navigateTo({
            url: '../../pages/comments/comments',
        })
    },
    /**
     * 正则过滤
     */
    delHtmlTag: function(str) {
        if(str==null){
            str="";
        }
        if (str == "") {
            return str;
        }
        return str.replace(/<[^>]+>/g, ""); //去掉所有的html标记
    }
})