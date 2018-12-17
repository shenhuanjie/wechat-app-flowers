//app.js
App({
	onLaunch: function() {},
	/**
	 * 用户点击退出登录
	 */
	onLogout: function() {
		wx.clearStorage();
		wx.navigateTo({
			url: '../../pages/login/login'
		})
	},
	/**
	 * 显示加载
	 */
	showLoading: function() {
		wx.showLoading({
			title: '加载中，请稍候...'
		})
	},
	/**
	 * 隐藏加载
	 */
	hideLoading: function() {
		wx.hideLoading();
	},
	/**
	 * 日期格式化
	 */
	formatDate: function(date, format) {
		if (!date || !format) {
			return "";
		}
		//Date.prototype.format = function(format){ 
		//}

		// 月(时分也一样)-- MM:07,11; M:7,11
		var o = {
			"M+": date.getMonth() + 1, //month 
			"d+": date.getDate(), //day 
			"h+": date.getHours(), //hour 
			"m+": date.getMinutes(), //minute 
			"s+": date.getSeconds(), //second 
			"q+": Math.floor((date.getMonth() + 3) / 3), //quarter 
			"S": date.getMilliseconds() //millisecond
		};

		// 年 yyyy
		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		// 星期 w
		if (/(w+)/.test(format)) {
			var weekArr = ["日", "一", "二", "三", "四", "五", "六"];
			format = format.replace(RegExp.$1, weekArr[date.getDay()]);
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	},
	uuid: function() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";

		var uuid = s.join("");
		return uuid;
	},
	globalData: {
		userInfo: null,
		// API_URL
		appUrl: "http://120.77.233.160:8965",
		// QINIU_PREFIX
		qiniuPrefix: "http://complaint.brightenflower.cn/",
		// 大图前缀
		imgPrefix: "http://www.brightenflower.cn/PicPath/",
		// 缩略图前缀
		thumbnailsPrefix: "http://www.brightenflower.cn/PicPath/img/"
	}
})
