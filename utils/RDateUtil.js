var RDateUtil = {
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
    copy: function(date) {
        if (!date) {
            return null;
        }
        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds(),
            date.getMilliseconds());
    },
    // 创建时间对象
    createDate: function(y, M, d, h, m, s) {
        y = y || "";
        M = M || "1";
        d = d || "1";
        h = h || "0";
        m = m || "0";
        s = s || "0";
        return new Date(y, M - 1, d, h, m, s);
    },
    // time: 时间毫秒数
    createDateByTime: function(time) {
        return new Date(time);
    },
    // formatStr: "2014-8-21 11:34:32"
    createDateByFormat: function(formatStr) {
        return new Date(formatStr);
    },
    addYear: function(date, s) {
        if (!date) {
            return null;
        }
        var newDate = RDateUtil.copy(date);
        newDate.setFullYear(newDate.getFullYear() + s);
        return newDate;
    },
    addMonth: function(date, s) {
        if (!date) {
            return null;
        }
        var newDate = RDateUtil.copy(date);
        newDate.setMonth(newDate.getMonth() + s);
        return newDate;
    },
    addDate: function(date, s) {
        if (!date) {
            return null;
        }
        var newDate = RDateUtil.copy(date);
        newDate.setDate(newDate.getDate() + s);
        return newDate;
    },
    addFormatDate: function(date, s, format) {
        var newDate = RDateUtil.formatDate(RDateUtil.addDate(date, s), format);
        return newDate;
    },
    addHour: function(date, s) {
        if (!date) {
            return null;
        }
        var newDate = RDateUtil.copy(date);
        newDate.setHours(newDate.getHours() + s);
        return newDate;
    },
    addMinute: function(date, s) {
        if (!date) {
            return null;
        }
        var newDate = RDateUtil.copy(date);
        newDate.setMinutes(newDate.getMinutes() + s);
        return newDate;
    },
    addSecond: function(date, s) {
        if (!date) {
            return null;
        }
        var newDate = RDateUtil.copy(date);
        newDate.setSeconds(newDate.getSeconds() + s);
        return newDate;
    },

    // 倒计时钟，ms：倒计时的总毫秒, callBack:每一次减少时间响应， finishBack：倒计时到0时响应
    countdownClock: function(ms, callBack, finishBack) {
        var nextFrame = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback) {
                    return setTimeout(callback, 17);
                }
        })();
        var cancelFrame = (function() {
            return window.cancelRequestAnimationFrame ||
                window.webkitCancelAnimationFrame ||
                window.webkitCancelRequestAnimationFrame ||
                window.mozCancelRequestAnimationFrame ||
                window.oCancelRequestAnimationFrame ||
                window.msCancelRequestAnimationFrame ||
                clearTimeout
        })();

        var clock;
        var leftTime = ms;
        var nextTime = Date.now();

        var setTime = function(mstime) {
            var s = parseInt(mstime / 1000); // 总秒数
            var hour = parseInt(s / 3600);
            var minute = parseInt(s / 60);
            var second = s % 60;
            hour = hour >= 10 ? "" + hour : "0" + hour;
            minute = minute >= 10 ? "" + minute : "0" + minute;
            second = second >= 10 ? "" + second : "0" + second;

            var millisecond = mstime % 1000;
            if (millisecond < 100) {
                if (millisecond < 10) {
                    millisecond = "00" + millisecond;
                } else {
                    millisecond = "0" + millisecond;
                }
            }
            if (callBack) {
                callBack({
                    hour: hour,
                    minute: minute,
                    second: second,
                    millisecond: millisecond
                });
            }
        };
        var animateFun = function(time) {
            var nowTime = Date.now();
            var deltaTime = nowTime - nextTime;

            leftTime = leftTime - deltaTime;
            nextTime = nowTime;

            if (leftTime <= 0) {
                setTime(0);
                cancelFrame(clock);
                if (finishBack) {
                    finishBack();
                }
            } else {
                setTime(leftTime);
                clock = nextFrame(animateFun);
            }
        };

        setTime(leftTime);
        clock = nextFrame(animateFun);
    }
};
module.exports = {
    formatDate: RDateUtil.formatDate,
    addFormatDate: RDateUtil.addFormatDate
}