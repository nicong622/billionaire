var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
window.buildingInfo = require('../utils/sta_buildings');
var ModalActions = require('../actions/modal-actions');
var Utils = require('../utils/utils');

var _panelState = {
    "root": false,
    "show": "",
    "data": []
};

var PanelStore = assign({}, EventEmitter.prototype, {
    getPanelState: function () {
        return _panelState;
    },
    emitChange: function () {
        this.emit("panel");
    },
    addChangeListener: function (events, callback) {
        this.on(events, callback);
    },
    removeChangeListener: function (events, callback) {
        this.removeListener(events, callback);
    }
});

// 注册事件回调
AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case AppConstants.GO_TO_SALE_PANEL:
            log("handle UPDATE_PUNISH_PANEL");
            // 关闭当前面板
            _panelState.root = false;
            _panelState.show = "";
            _panelState.data = "";
            PanelStore.emitChange();
            // 打开商店
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 8001
            }, function (response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    _panelState.root = true;
                    _panelState.show = "sale";
                    _panelState.data = response.data;
                    if (_panelState.data.length % 2 != 0) {
                        _panelState.data.push({})
                    }
                    PanelStore.emitChange();
                } else {
                    alert(response.msg)
                }
            });
            break;
        case AppConstants.UPDATE_PUNISH_PANEL:
            log("handle UPDATE_PUNISH_PANEL");
            _panelState.root = false;
            _panelState.show = "punish";
            _panelState.data = gameData.punishment;
            PanelStore.emitChange();
            break;
        case AppConstants.SHARE_WEIXIN:
            log("handle SHARE_WEIXIN");
            $('.ShareWeiXinWrap').removeClass("hidden");
            Utils.shareWeiXin(gameData.user_info.nick_name + "：我需要你的帮助！", "我的商业帝国遇到了一些麻烦，能帮帮我吗？感激不尽。");
            break;
        case AppConstants.PROCESS_PUNISHMENT:
            log("handle PROCESS_PUNISHMENT");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 6000,
                "punish_id": action.id,
                "deal_type": action.type
            }, function (response) {
                $('.network-loading').addClass('hidden');
                if (response.status == 'success') {
                    // 关闭惩罚面板
                    gameData.punishment = {};
                    _panelState.root = false;
                    _panelState.show = "punish";
                    _panelState.data = [];
                    PanelStore.emitChange();
                    // 更新用户信息
                    gameData.score_info.cash = response.data.cash;
                    gameData.score_info.worth = response.data.total_property;
                    gameData.score_info.crystal = response.data.diamond;
                    ModalActions.updateInfoBox();
                    Utils.shareWeiXin();
                } else {
                    alert(response.msg)
                }
            });
            break;
        case AppConstants.CLOSE_PUNISHMENT_PANEL:
            log("handle CLOSE_PUNISHMENT_PANEL");
            gameData.punishment = {};
            _panelState.root = false;
            _panelState.show = "punish";
            _panelState.data = [];
            PanelStore.emitChange();
            break;
        case AppConstants.GET_EVENTS_REWARD:
            log("handle GET_ACHIEVEMENTS_REWARD");
            var originalCash = gameData.score_info.cash;

            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 1104,
                "activity_id": action.id
            }, function (response) {
                $('.network-loading').addClass('hidden');
                if (response.status == 'success') {
                    gameData.score_info.cash = response.data.cash;
                    gameData.score_info.worth = response.data.total_property;
                    gameData.score_info.crystal = response.data.diamond;

                    TDGA.onReward(response.data.cash - originalCash, '每日签到');

                    ModalActions.updateInfoBox();
                } else {
                    alert(response.msg)
                }
                _panelState.root = false;
                _panelState.show = "";
                _panelState.data = "";
                PanelStore.emitChange();
            });
            break;
        case AppConstants.GET_ACHIEVEMENTS_REWARD:
            log("handle GET_ACHIEVEMENTS_REWARD");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 7001,
                "achievement_id": action.id
            }, function (response) {
                $('.network-loading').addClass('hidden');
                if (response.status == 'success') {
                    // 播放动画
                    Utils.diamondAnimation();
                    gameData.score_info.cash = response.data.cash;
                    gameData.score_info.worth = response.data.total_property;
                    gameData.score_info.crystal = response.data.diamond;
                    ModalActions.updateInfoBox();
                } else {
                    alert(response.msg)
                }
            });
            break;
        case AppConstants.buyLandMark:
            log("handle buyLandMark");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 9001,
                "landmark_id": action.id
            }, function (response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    gameData.score_info.cash = response.data.cash;
                    gameData.score_info.worth = response.data.total_property;
                    gameData.score_info.crystal = response.data.diamond;
                    AppDispatcher.dispatch({
                        actionType: AppConstants.ADD_LANDMARK,
                        id: action.id
                    });
                    AppDispatcher.dispatch({
                        actionType: AppConstants.CLOSE_ALERT_MODAL
                    });
                    ModalActions.updateInfoBox();
                    PanelStore.emitChange();
                } else {
                    alert(response.msg)
                }
            });
            break;
        case AppConstants.CONFIRM_ORDER:
            log("handle CONFIRM_ORDER");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 8000,
                "mall_id": action.data.id
            }, function (response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    if (!!response.data.url) {
                        window.location.href = response.data.url
                    } else {
                        alert("购买成功");
                        gameData.score_info.cash = response.data.cash;
                        gameData.score_info.worth = response.data.total_property;
                        gameData.score_info.crystal = response.data.diamond;
                        AppDispatcher.dispatch({
                            actionType: AppConstants.CLOSE_ALERT_MODAL
                        });

                        if(!!action.data.costdiamond) {
                            TDGA.onItemUse({
                                item : action.data.information,
                                itemNumber : action.data.costdiamond
                            });
                        }

                        ModalActions.updateInfoBox();
                    }
                } else {
                    alert(response.msg);
                }
            });
            PanelStore.emitChange();
            break;
        case AppConstants.SHOW_BUSINESS_PANEL:
            log("handle SHOW_BUSINESS_PANEL");
            var tempBuildingInfo = assign({}, buildingInfo);
            // 拷贝数组，已经存在的不渲染
            _panelState.data = [];
            for (var i = 0; i < gameData.building_info.length; i++) {
                for (var key in tempBuildingInfo) {
                    if (gameData.building_info[i].id == tempBuildingInfo[key].id) {
                        delete tempBuildingInfo[key];
                    }
                }
            }
            for (var subKey in tempBuildingInfo) {
                _panelState.data.push(tempBuildingInfo[subKey]);
            }
            _panelState.data.sort(function(a,b){
                return a.position - b.position;
            });
            _panelState.root = true;
            _panelState.show = "business";
            if (_panelState.data.length % 2 != 0) {
                _panelState.data.push({})
            }
            PanelStore.emitChange();
            break;
        case AppConstants.SHOW_SORCERY_PANEL:
            log("handle SHOW_SORCERY_PANEL");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 3004
            }, function (response) {
                $('.network-loading').addClass('hidden');
                _panelState.root = true;
                _panelState.show = "sorcery";
                _panelState.data = response.data;
                PanelStore.emitChange();
            });
            break;
        case AppConstants.BUY_SORCERYITEM:
            log("handle BUY_SORCERYITEM");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 3000,
                "prop_id": action.id
            }, function (response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    alert("购买成功");
                    _panelState.root = false;
                    _panelState.show = "";
                    _panelState.data = "";
                    gameData.score_info.crystal = response.data.diamond;
                    gameData.props[0].tap_speed = response.data.tap_speed;
                    ModalActions.updateInfoBox();
                    PanelStore.emitChange();
                    if (action.id == 2) {
                        window.stateProtectionEnd = parseInt(Date.now() / 1000 + 24 * 3600);
                        localStorage.setItem('billionaire-state-protection-end-' + gameData.user_info.openid, window.stateProtectionEnd)
                    } else {
                        $('.TapSpeed').text(-gameData.props[0].tap_speed)
                    }
                } else {
                    alert(response.msg)
                }
            });
            break;
        case AppConstants.SHOW_SALE_PANEL:
            log("handle SHOW_SALE_PANEL");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 8001
            }, function (response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    _panelState.root = true;
                    _panelState.show = "sale";
                    _panelState.data = response.data;
                    if (_panelState.data.length % 2 != 0) {
                        _panelState.data.push({})
                    }
                    PanelStore.emitChange();
                } else {
                    alert(response.msg)
                }
            });
            break;
        case AppConstants.SHOW_NOTICE_PANEL:
            log("handle SHOW_NOTICE_PANEL");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 5000,
                "skip": 0,
                "limit": 10
            }, function (response) {
                $('.network-loading').addClass('hidden');
                $('.notice').removeClass("newMsg");
                if (response.status == "success") {
                    _panelState.root = true;
                    _panelState.show = "message";
                    _panelState.data = response.data;
                    PanelStore.emitChange();
                }
            });
            break;
        case AppConstants.SHOW_LANDMARK_PANEL:
            log("handle SHOW_LANDMARK_PANEL");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 9000
            }, function (response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    _panelState.root = true;
                    _panelState.show = "landmark";
                    _panelState.data = response.data;
                    PanelStore.emitChange();
                }
            });
            break;
        case AppConstants.SHOW_EVENT_PANEL:
            log("handle SHOW_EVENT_PANEL");
            $('.network-loading').removeClass('hidden');
            $('.event').removeClass("newMsg");
            $.post(hostUrl, {
                "cmd": 1100
            }, function (response) {
                $('.network-loading').addClass('hidden');
                _panelState.root = true;
                _panelState.show = "events";
                if (response.data.length < 3) {
                    _panelState.data = response.data;
                    _panelState.data.push({});
                    _panelState.data.push({});
                    _panelState.data.push({})
                } else {
                    _panelState.data = response.data;
                }
                PanelStore.emitChange();
            });
            break;
        case AppConstants.SHOW_ACHIEVEMENTS_PANEL:
            log("handle SHOW_ACHIEVEMENTS_PANEL");

            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 7000
            }, function (response) {
                $('.network-loading').addClass('hidden');
                _panelState.root = true;
                _panelState.show = "achievements";
                _panelState.data = response.data;
                PanelStore.emitChange();
            });

            break;
        case AppConstants.CLOSE_PANEL:
            log("handle CLOSE_PANEL");
            _panelState.root = false;
            _panelState.show = "";
            _panelState.data = "";
            PanelStore.emitChange();
            break;
        default:
        // pass
    }
});

module.exports = PanelStore;
