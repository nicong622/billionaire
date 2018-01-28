module.exports = {
    fixData: function() {
        // 读取 URL 参数
        window.QueryString = function() {
            // This function is anonymous, is executed immediately and
            // the return value is assigned to QueryString!
            var query_string = {};
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for(var i = 0; i < vars.length; i++) {
                var pair = vars[i].split("=");
                // If first entry with this name
                if(typeof query_string[pair[0]] === "undefined") {
                    query_string[pair[0]] = decodeURIComponent(pair[1]);
                    // If second entry with this name
                } else if(typeof query_string[pair[0]] === "string") {
                    var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                    query_string[pair[0]] = arr;
                    // If third or later entry with this name
                } else {
                    query_string[pair[0]].push(decodeURIComponent(pair[1]));
                }
            }
            return query_string;
        }();
        if(window.location.href.indexOf("local=1") > -1) {
            window.log = function(x) {
                console.log(x)
            };
            $('link')[0].href = "http://localhost:3000/styles/main.css"
        }
        window.surpassData = {};
        for(var i = 0; i < gameData.building_info.length; i++) {
            if(!!gameData.building_info[i].landmark_id) {
                gameData.building_info[i].id = gameData.building_info[i].landmark_id + 1000;
                gameData.building_info[i].status = 2;
                gameData.building_info[i].type = "landmark"
            } else {
                gameData.building_info[i].type = "notLandmark"
            }
        }

        function count() {
            var now = Date.now();
            if(now - window.landmarkTimer >= 1000) {
                if(!!window.landmarkData) {
                    for(var i = 0; i < landmarkData.length; i++) {
                        if(now / 1000 < landmarkData[i].time) {
                            var time = (landmarkData[i].time - now / 1000).toString().toHHMMSS();
                            $('.LandmarkItemBtn').eq(i).text(time)
                        }
                    }
                    window.landmarkTimer = now;
                }
            }
            requestAnimationFrame(count);
        }

        window.landmarkTimer = Date.now();
        requestAnimationFrame(count);
    },
    clone: function(obj) {
        if(null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for(var attr in obj) {
            if(obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    },
    StringtoHHMMSS: function() {
        String.prototype.toHHMMSS = function() {
            var sec_num = parseInt(this, 10); // don't forget the second param
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if(hours < 10) {
                hours = "0" + hours;
            }
            if(minutes < 10) {
                minutes = "0" + minutes;
            }
            if(seconds < 10) {
                seconds = "0" + seconds;
            }
            return time = hours + ':' + minutes + ':' + seconds;
        }
    },
    get_time_remaining_from_cache: function() {
        for(var i = 0; i < gameData.building_info.length; i++) {
            if(gameData.building_info[i].status != 2) {
                var endTime = parseInt(localStorage.getItem('billionaire-building-end-' + gameData.user_info.openid + '-' + gameData.building_info[i].id))
                if(!!endTime) {
                    var time_remaining = endTime - parseInt(Date.now() / 1000);
                    if(time_remaining <= 0) {
                        gameData.building_info[i].time_remaining = 0;
                    } else {
                        gameData.building_info[i].time_build_end = endTime;
                        gameData.building_info[i].time_remaining = time_remaining / 60;
                    }
                } else {
                    endTime = gameData.building_info[i].time * 60 + parseInt(Date.now() / 1000);
                    localStorage.setItem('billionaire-building-end-' + gameData.user_info.openid + '-' + gameData.building_info[i].id, endTime)
                    gameData.building_info[i].time_build_end = endTime;
                    gameData.building_info[i].time_remaining = gameData.building_info[i].time
                }
            }
        }
        // 保护道具
        window.stateProtectionEnd = parseInt(localStorage.getItem('billionaire-state-protection-end-' + gameData.user_info.openid))
        if(!window.stateProtectionEnd) {
            window.stateProtectionEnd = 0;
        }
    },
    stopTouchMove: function() {
        document.body.addEventListener("touchmove", function(i) {
            event.preventDefault(); // 取消 touchmove 的默认动作
        });
        document.body.addEventListener("touchstart", function(i) {
            event.preventDefault(); // 取消 touchstart 的默认动作
        });
    },
    css: function() {
        // get w and h
        var win = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            w = win.innerWidth || e.clientWidth || g.clientWidth,
            h = win.innerHeight || e.clientHeight || g.clientHeight;
        document.querySelector(".CollectBar").style.height = (w * 0.15) + "px";

        // 计算头像居中
        var avatarWidth = 80 / 208 * (208 / 1136 * h) + 6;
        var userInfoWidth = 136 / 640 * w;
        var userInfoHeight = (208 / 1136 * h * (136 / 208));
        document.querySelector(".avatar").style.top = ((userInfoHeight - avatarWidth) / 2) + "px";
        document.querySelector(".avatar").style.left = ((userInfoWidth - avatarWidth) / 2) + "px";

        // 加载完成判断是否显示现金飘落
        if(gameData.building_info.length > 0 && gameData.building_info.length != activeBuildingIndex
            && gameData.building_info[activeBuildingIndex].cash_pool == gameData.building_info[activeBuildingIndex].maxincome) {
            $('[class^="cashAnimationWrapper"]').hide()
        }
    },
    // 数字加上逗号
    numberWithCommas: function(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    numberToShort: function(x) {
        var fixNum = function(x, base, unit) {
            var num = parseFloat(x / base).toString(),
                intNum = num.split('.')[0],
                floatNum;

            if(!!num.split('.')[1]) {
                floatNum = '.' + num.split('.')[1].slice(0, 2);
            } else {
                floatNum = ''
            }
            return intNum + floatNum + unit;
        };

        if(x >= 1e16) {
            return fixNum(x, 1e16, '兆');
        } else if(x >= 1e8) {
            return fixNum(x, 1e8, '亿');
        } else if(x >= 1e4) {
            return fixNum(x, 1e4, '万');
        } else {
            return x;
        }
    },
    getShareHost: function() {
        //根据游戏在不同渠道的链接来动态获取分享链接的host部分
        var gameLink = window.location.href,
            index = gameLink.indexOf('?');
        return gameLink.slice(0, index);
    },
    initShareWeiXin: function() {
        wx.config(gameData.js_api);
        wx.ready(function() {
            var title = gameData.user_info.nick_name + "：一起来创建商业帝国";
            //var link = "http://billionaire.meiriq.com/meiriq?invite_id=" + gameData.user_info.invite_id + '&td_channelid=' + QueryString.td_channelid;
            var link = this.getShareHost() + "?invite_id=" + gameData.user_info.invite_id + '&td_channelid=' + QueryString.td_channelid;
            var imgUrl = gameData.user_info.pic_link;
            var desc = "我已经开启了自己的商业帝国，正在挑战王思聪和马云。";
            if(Math.random() >= 0.5) {
                title = gameData.user_info.nick_name + "：我正在招小弟";
                desc = "我想用一台法拉利聘请你帮我数钱，快来玩。"
            }

            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                success: function() {
                    // 用户确认分享后执行的回调函数
                    TDGA.onMissionBegin('分享朋友圈');
                    TDGA.onMissionCompleted('分享朋友圈');
                },
                cancel: function() {
                }
            });

            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: link, // 分享链接
                imgUrl: imgUrl, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function() {
                    TDGA.onMissionBegin('分享给朋友');
                    TDGA.onMissionCompleted('分享给朋友');
                },
                cancel: function() {
                }
            });
        }.bind(this))
    },
    shareWeiXin: function(_title, _desc, callback) {

        var title = gameData.user_info.nick_name + "：一起来创建商业帝国";
        //var link = "http://billionaire.meiriq.com/meiriq?invite_id=" + gameData.user_info.invite_id + '&td_channelid=' + QueryString.td_channelid;
        var link = this.getShareHost() + "?invite_id=" + gameData.user_info.invite_id + '&td_channelid=' + QueryString.td_channelid;
        var imgUrl = gameData.user_info.pic_link;
        var desc = "我已经开启了自己的商业帝国，正在挑战王思聪和马云。";
        if(!!_title) {
            title = _title;
            desc = _desc;
        }

        wx.onMenuShareTimeline({
            title: title, // 分享标题
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            success: function() {
                if(!!callback) {
                    callback();
                }
                TDGA.onMissionBegin('分享朋友圈');
                TDGA.onMissionCompleted('分享朋友圈');
            },
            cancel: function() {
            }
        });

        wx.onMenuShareAppMessage({
            title: title, // 分享标题
            desc: desc, // 分享描述
            link: link, // 分享链接
            imgUrl: imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function() {
                TDGA.onMissionBegin('分享给朋友');
                TDGA.onMissionCompleted('分享给朋友');
            },
            cancel: function() {
            }
        });
    },
    collectCashAnimation: function() {
        var i = 0;
        var $cash = $(".cash");
        var cashNum = $cash.length;
        var b = (67 - cashNum);
        $($cash.get().reverse()).each(function() {
            var top = -100 - (i * 2.5) - b;
            $(this).css('-webkit-transition', 'all 0.5s linear ' + i * 0.03 + 's');
            $(this).css('-webkit-transform', 'translate(-150px,' + top + 'px)');
            $(this).css('opacity', 0);
            i++;
        });
        $('[class^="cashAnimationWrapper"]').show()
    },
    diamondAnimation: function() {
        $($("[class^='diamondIconAnimation']").get().reverse()).each(function() {
            var left = -window.innerWidth / 2 + 30;
            var top = -window.innerHeight * 0.9;
            $(this).css('-webkit-transform', 'translate(' + left + 'px,' + top + 'px)')
            $(this).css('opacity', 0)
        });
        setTimeout(function() {
            $("[class^='diamondIconAnimation']").remove();
            $('.Panel').parent().append('<div class="diamondIconAnimation-1" data-reactid=".0.4.2"></div><div class="diamondIconAnimation-2" data-reactid=".0.4.3"></div><div class="diamondIconAnimation-3" data-reactid=".0.4.4"></div>')
        }, 1400);
    },
    cashAnimation: function() {
        $($("[class^='cashIconAnimation']").get().reverse()).each(function() {
            var left = -window.innerWidth / 2 + 30;
            var top = -window.innerHeight * 0.9;
            $(this).css('-webkit-transform', 'translate(' + left + 'px,' + top + 'px)');
            $(this).css('opacity', 0)
        });
        setTimeout(function() {
            $("[class^='cashIconAnimation']").remove();
            $('.RankingList').parent().append('<div class="cashIconAnimation-1" data-reactid=".0.4.2"></div><div class="cashIconAnimation-2" data-reactid=".0.4.3"></div><div class="cashIconAnimation-3" data-reactid=".0.4.4"></div>')
        }, 1400);
    },
    speedUpOnceMore(buildingId){
        //在localstorage中记录某个建筑物点击加速的次数
        var count = localStorage.getItem('speedUpCounting_' + buildingId);

        count = JSON.parse(count);
        count++;
        localStorage.setItem('speedUpCounting_' + buildingId, JSON.stringify(count));
    },
    getClickTimes(buildingId){
        //返回点击加速的次数
        var times = localStorage.getItem('speedUpCounting_' + buildingId);
        return JSON.parse(times);
    }
};
