var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Utils = require('../utils/utils');

var CHANGE_EVENT = 'change';
var _rankingListState = {};

var RankingListStore = assign({}, EventEmitter.prototype, {
    getRankingState: function() {
        return _rankingListState
    },
    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// 注册事件回调
AppDispatcher.register(function(action) {
    switch (action.actionType) {
        case AppConstants.SHOW_NATIONAL_RANK:
            log("handle SHOW_NATIONAL_RANK");
            _rankingListState.show = true;
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 4000,
                "limit": 20,
                "skip": 0
            }, function(response) {
                if (response.status == "success") {
                    if (response.data.rank > 20) {
                        $.post(hostUrl, {
                            "cmd": 4001,
                            "limit": 2
                        }, function(response2) {
                            $('.network-loading').addClass('hidden');
                            if (response2.status == "success") {
                                _rankingListState.data = response.data.rank_list;
                                for (var i = 0; i < response2.data.rank_list.length; i++) {
                                    _rankingListState.data.push(response2.data.rank_list[i])
                                };
                                _rankingListState.myRank = response.data.rank
                                for (var i = 0; i < _rankingListState.data.length; i++) {
                                    _rankingListState.data[i].is_robot = true;
                                };
                                RankingListStore.emitChange();
                            } else {
                                alert(response2.msg)
                            }
                        });
                    } else {
                        $('.network-loading').addClass('hidden');
                        _rankingListState.data = response.data.rank_list;
                        for (var i = 0; i < _rankingListState.data.length; i++) {
                            _rankingListState.data[i].is_robot = true;
                        };
                        RankingListStore.emitChange();
                    }
                } else {
                    alert(response.msg);
                }
            })
            break;
        case AppConstants.SHOW_PROVINCE_RANK:
            log("handle SHOW_PROVINCE_RANK");
            _rankingListState.show = true;
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 4000,
                "limit": 20,
                "province": 1,
                "skip": 0
            }, function(response) {
                if (response.status == "success") {
                    if (response.data.rank > 20) {
                        $.post(hostUrl, {
                            "cmd": 4001,
                            "limit": 2,
                            "province": 1
                        }, function(response2) {
                            $('.network-loading').addClass('hidden');
                            if (response2.status == "success") {
                                _rankingListState.data = response.data.rank_list;
                                for (var i = 0; i < response2.data.rank_list.length; i++) {
                                    _rankingListState.data.push(response2.data.rank_list[i])
                                }
                                _rankingListState.myRank = response.data.rank;
                                for (var i = 0; i < _rankingListState.data.length; i++) {
                                    _rankingListState.data[i].is_robot = true;
                                }
                                RankingListStore.emitChange();
                            } else {
                                alert(response2.msg)
                            }
                        });
                    } else {
                        $('.network-loading').addClass('hidden');
                        _rankingListState.data = response.data.rank_list;
                        for (var i = 0; i < _rankingListState.data.length; i++) {
                            _rankingListState.data[i].is_robot = true;
                        }
                        RankingListStore.emitChange();
                    }
                } else {
                    alert(response.msg);
                }
            });
            break;
        case AppConstants.SHOW_RANK_PANEL:
            log("handle SHOW_RANK_PANEL");
            _rankingListState.show = true;
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 4002,
                "skip": 0,
                "limit": 100
            }, function(response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    _rankingListState.data = response.data;
                    _rankingListState.myRank = undefined;
                    RankingListStore.emitChange();
                } else {
                    alert(response.msg);
                }
            });
            break;
        case AppConstants.CLOSE_RANK_PANEL:
            log("handle CLOSE_RANK_PANEL");
            _rankingListState.show = false;
            RankingListStore.emitChange();
            break;
        case AppConstants.RANKING_PLAY_WITH_FRIEND:
            log("handle RANKING_PLAY_WITH_FRIEND");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 1200,
                "friend_id": action.friend_id
            }, function(response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    // 播放动画
                    Utils.cashAnimation();
                    // 更新用户信息
                    gameData.score_info.cash = response.data.cash
                    gameData.score_info.worth = response.data.total_property
                    gameData.score_info.crystal = response.data.diamond
                    gameData.score_info.threat = response.data.threat
                    AppDispatcher.dispatch({
                        actionType: AppConstants.UPDATE_INFO_BOX
                    });
                } else {
                    alert(response.msg)
                }
            })
            break;
        default:
            // pass
    }
});

module.exports = RankingListStore;
