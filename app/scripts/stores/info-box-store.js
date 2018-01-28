var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var Utils = require('../utils/utils');

var CHANGE_EVENT = 'change';

var InfoBoxStore = assign({}, EventEmitter.prototype, {
    getUserInfo: function() {
        return gameData.user_info
    },
    getScoreInfo: function() {
        return gameData.score_info
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
        case AppConstants.COLLECT_MONEY:
            log("handle COLLECT_MONEY")
            if (gameData.building_info[window.activeBuildingIndex].type == 'landmark') {
                document.getElementById('BuildingMoney').innerText = 0;
                $('[class^="cashAnimationWrapper"]').show()
                $('.fullIcon').addClass('hidden')
                // 更新用户信息
                gameData.score_info.cash = gameData.score_info.cash+gameData.building_info[activeBuildingIndex].cash_pool
                gameData.score_info.worth = gameData.score_info.worth+gameData.building_info[activeBuildingIndex].cash_pool
                InfoBoxStore.emitChange();
                // 更新现金池显示
                (function() {
                    // 动画播放
                    var _index = activeBuildingIndex;
                    Utils.collectCashAnimation();
                    setTimeout(function() {
                        // 重置建筑收益与定时器
                        gameData.building_info[_index].cash_pool = 0;
                        gameData.building_info[_index].start = Date.now();
                        gameData.building_info[_index].status = 2;
                        AppDispatcher.dispatch({
                            actionType: AppConstants.UPDATE_COLLECT_MONEY_CASH_BOX
                        });
                        var fullAlert = false;
                        for (var i = 0; i < gameData.building_info.length; i++) {
                            if (gameData.building_info[i].status == 2 && gameData.building_info[i].cash_pool == gameData.building_info[i].maxincome && gameData.building_info[i].maxincome > 0) {
                                var fullAlert = true;
                            }
                        };
                        if (!fullAlert) {
                            $('.fullAlert').attr('class', 'fullAlert hidden')
                            $('[class^="cashAnimationWrapper"]').show()
                        }

                    }, 2500)
                })();

                if (gameData.building_info[window.activeBuildingIndex].cash_pool>gameData.building_info[window.activeBuildingIndex].income/12) {
                    $.post(hostUrl, {
                        "cmd": 9002,
                        "landmark_id": gameData.building_info[activeBuildingIndex].id - 1000
                    }, function(response) {
                        if (response.status == "success") {
                            // 更新用户信息
                            gameData.score_info.cash = response.data.cash
                            gameData.score_info.worth = response.data.total_property
                            gameData.score_info.crystal = response.data.diamond
                            gameData.score_info.threat = response.data.threat
                            gameData.user_info.rank = response.data.rank;
                            InfoBoxStore.emitChange();
                            // 处理超越 NPC
                            if (!!response.data.complete_achievement) {
                                window.surpassData = response.data.complete_achievement
                                AppDispatcher.dispatch({
                                    actionType: AppConstants.SHOW_SURPASS_MODAL
                                });
                            }
                            if (!!response.data.complete_activity) {
                                $('.event').addClass("newMsg");
                            }
                            if (response.data.new_mail == true) {
                                $('.notice').addClass("newMsg");
                            }
                            // 处理惩罚
                            if (!!response.data.punishment) {
                                gameData.punishment = response.data.punishment;
                                // 更新惩罚面板
                                AppDispatcher.dispatch({
                                    actionType: AppConstants.UPDATE_PUNISH_PANEL
                                });
                            }
                        } else {
                            alert(response.msg);
                        }
                    })
                }

            } else {
                // 预处理收获
                document.getElementById('BuildingMoney').innerText = 0;
                $('[class^="cashAnimationWrapper"]').show()
                $('.fullIcon').addClass('hidden')
                // 更新显示数据
                // 更新用户信息
                gameData.score_info.cash = gameData.score_info.cash+gameData.building_info[activeBuildingIndex].cash_pool
                gameData.score_info.worth = gameData.score_info.worth+gameData.building_info[activeBuildingIndex].cash_pool
                InfoBoxStore.emitChange();
                // 更新现金池显示
                (function() {
                    // 动画播放
                    var _index = activeBuildingIndex;
                    Utils.collectCashAnimation();
                    setTimeout(function() {
                        // 重置建筑收益与定时器
                        gameData.building_info[_index].cash_pool = 0;
                        gameData.building_info[_index].start = Date.now();
                        gameData.building_info[_index].status = 2;
                        AppDispatcher.dispatch({
                            actionType: AppConstants.UPDATE_COLLECT_MONEY_CASH_BOX
                        });
                        var fullAlert = false;
                        for (var i = 0; i < gameData.building_info.length; i++) {
                            if (gameData.building_info[i].status == 2 && gameData.building_info[i].cash_pool == gameData.building_info[i].maxincome && gameData.building_info[i].maxincome > 0) {
                                var fullAlert = true;
                            }
                        };
                        if (!fullAlert) {
                            $('.fullAlert').attr('class', 'fullAlert hidden')
                            $('[class^="cashAnimationWrapper"]').show()
                        }
                    }, 2500)
                })();
                if (gameData.building_info[window.activeBuildingIndex].cash_pool>gameData.building_info[window.activeBuildingIndex].income/12) {
                    $.post(hostUrl, {
                        "cmd": 2003,
                        "building_id": gameData.building_info[activeBuildingIndex].id
                    }, function(response) {
                        if (response.status == "success") {
                            // 更新用户信息
                            gameData.score_info.cash = response.data.cash;
                            gameData.score_info.worth = response.data.total_property;
                            gameData.score_info.crystal = response.data.diamond;
                            gameData.score_info.threat = response.data.threat;
                            if(!!response.data.rank){
                                gameData.user_info.rank = response.data.rank;
                            }
                            InfoBoxStore.emitChange();
                            // 处理超越 NPC
                            if (!!response.data.complete_achievement) {
                                window.surpassData = response.data.complete_achievement;
                                AppDispatcher.dispatch({
                                    actionType: AppConstants.SHOW_SURPASS_MODAL
                                });
                            }
                            // 处理惩罚
                            if (!!response.data.punishment) {
                                gameData.punishment = response.data.punishment;
                                // 更新惩罚面板
                                AppDispatcher.dispatch({
                                    actionType: AppConstants.UPDATE_PUNISH_PANEL
                                });
                            }
                            if (!!response.data.complete_activity) {
                                $('.event').addClass("newMsg");
                            }
                            if (response.data.new_mail == true) {
                                $('.notice').addClass("newMsg");
                            }
                        } else {
                            alert(response.msg);
                        }
                    })
                }
            }
            break;
        case AppConstants.UPDATE_INFO_BOX:
            log("handle UPDATE_INFO_BOX");
            InfoBoxStore.emitChange();
            break;
        default:
            // pass
    }
});

module.exports = InfoBoxStore;
