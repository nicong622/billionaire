var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var ModalActions = require('../actions/modal-actions');
var CollectMoneyActions = require('../actions/collect-money-actions');

var _modalState = {};

var ModalStore = assign({}, EventEmitter.prototype, {
    getModalState: function() {
        return _modalState;
    },
    emitChange: function(events) {
        this.emit(events);
        //this.emit("mask");
    },
    addChangeListener: function(events, callback) {
        this.on(events, callback);
    },
    removeChangeListener: function(events, callback) {
        this.removeListener(events, callback);
    }
});

// 注册事件回调
AppDispatcher.register(function(action) {
    switch (action.actionType) {
        case AppConstants.SHOW_CONFIRM_ALERT:
            log("handle SHOW_CONFIRM_ALERT");
            _modalState.mask = !_modalState.mask;
            _modalState.alert = !_modalState.alert;
            _modalState.cost = action.cost;
            _modalState.name = action.name;
            _modalState.id = action.id;
            _modalState.type = action.type;
            _modalState.data = window.buyBuildingInfo;
            _modalState.action = 'buyLandMark';
            ModalStore.emitChange('alert');
            break;
        case AppConstants.ORDER_SOMETHING:
            log("handle ORDER_SOMETHING");
            _modalState.mask = !_modalState.mask;
            _modalState.alert = !_modalState.alert;
            _modalState.action = "order";
            _modalState.data = action.data;
            ModalStore.emitChange('alert');
            break;
        case AppConstants.BUY_BUILDING:
            log("handle BUY_BUILDING");
            _modalState.mask = !_modalState.mask;
            _modalState.alert = !_modalState.alert;
            _modalState.action = "buyBuilding";
            _modalState.data = window.buyBuildingInfo;
            ModalStore.emitChange('alert');
            break;
        case AppConstants.ALERT_HELP_TEXT:
            log("handle ALERT_HELP_TEXT");
            _modalState.mask = true;
            _modalState.alert = true;
            _modalState.action = "alertHelpText";
            ModalStore.emitChange('alert');
            break;
        case AppConstants.ALERT_NEED_MORE_MONEY:
            log("handle ALERT_NEED_MORE_MONEY");
            _modalState.mask = !_modalState.mask;
            _modalState.alert = !_modalState.alert;
            _modalState.action = "alertNeedMoreMoney";
            _modalState.data = {
                "rmb": action.rmb,
                "limit": action.limit
            }
            ModalStore.emitChange('alert');
            break;
        case AppConstants.CLOSE_ALERT_MODAL:
            log("handle CLOSE_ALERT_MODAL");
            _modalState.mask = false;
            _modalState.alert = false;
            ModalStore.emitChange('alert');
            break;
        case AppConstants.TOGGLE_THREAT_MODAL:
            log("handle TOGGLE_THREAT_MODAL");
            _modalState.mask = !_modalState.mask;
            _modalState.threat = !_modalState.threat;
            ModalStore.emitChange("threat");
            break;
        case AppConstants.CLOSE_THREAT_MODAL:
            log("handle CLOSE_THREAT_MODAL");
            _modalState.mask = false;
            _modalState.threat = false;
            ModalStore.emitChange("threat");
            break;
        case AppConstants.SHOW_SURPASS_MODAL:
            log("handle SHOW_SURPASS_MODAL");
            _modalState.mask = true;
            _modalState.surpass = true;
            ModalStore.emitChange("surpass");
            break;
        case AppConstants.SHOW_UPGRADE_MODAL:
            log("handle SHOW_UPGRADE_MODAL");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 2006,
                "building_id": gameData.building_info[activeBuildingIndex].id,
                "lv": gameData.building_info[activeBuildingIndex].level + 1
            }, function(response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    _modalState.mask = true;
                    _modalState.upgrade = true;
                    _modalState.data = response.data;
                    window.preUpgradeBuildingInfo = _modalState.data;
                    ModalStore.emitChange("upgrade");
                } else {
                    alert(response.msg);
                }
            })
            break;
        case AppConstants.UPGRADE_BUILDING_START:
            log("handle UPGRADE_BUILDING_START");
            _modalState.mask = false;
            _modalState.upgrade = false;
            ModalStore.emitChange("upgrade");
            break;
        case AppConstants.CLOSE_UPGRADE_MODAL:
            log("handle CLOSE_UPGRADE_MODAL");
            _modalState.mask = false;
            _modalState.upgrade = false;
            ModalStore.emitChange("upgrade");
            break;
        case AppConstants.SHOW_SALE_MODAL:
            log("handle SHOW_SALE_MODAL");
            _modalState.mask = true;
            _modalState.sale = true;
            _modalState.data = gameData.building_info[activeBuildingIndex];
            ModalStore.emitChange("sale");
            break;
        case AppConstants.CLOSE_SALE_MODAL:
            log("handle CLOSE_SALE_MODAL");
            _modalState.mask = false;
            _modalState.sale = false;
            ModalStore.emitChange("sale");
            break;
        case AppConstants.CLOSE_SURPASS_MODAL:
            log("handle CLOSE_SURPASS_MODAL");
            _modalState.mask = false;
            _modalState.surpass = false;
            ModalStore.emitChange("surpass");
            break;
        case AppConstants.SALE_BUILDING:
            log("handle SALE_BUILDING");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 2004,
                "building_id": gameData.building_info[activeBuildingIndex].id,
                "lv": gameData.building_info[activeBuildingIndex].level + 1
            }, function(response) {
                $('.network-loading').addClass('hidden');
                if (response.status == "success") {
                    // 更新用户信息
                    gameData.score_info.cash = response.data.cash
                    gameData.score_info.worth = response.data.total_property
                    gameData.score_info.crystal = response.data.diamond
                    gameData.score_info.threat = response.data.threat
                    ModalActions.updateInfoBox();
                    // 更新建筑信息与现金池
                    gameData.building_info.splice(activeBuildingIndex, 1)
                    CollectMoneyActions.updateCollectMoney()
                    AppDispatcher.dispatch({
                        actionType: AppConstants.UPDATE_BUILDING
                    });
                    _modalState.mask = false;
                    _modalState.sale = false;
                    ModalStore.emitChange("sale");
                    // 更新现金满提醒图标
                    for (var i = 0; i < gameData.building_info.length; i++) {
                        if (gameData.building_info[i].status == 2 && gameData.building_info[i].cash_pool == gameData.building_info[i].maxincome && gameData.building_info[i].maxincome > 0) {
                            $('.fullAlert').attr('class', 'fullAlert')
                        } else {
                            $('.fullAlert').attr('class', 'fullAlert hidden')
                        }
                    }
                } else {
                    alert(response.msg);
                }
            })

            break;
        case AppConstants.GET_SURPASS_REWARD:
            log("handle GET_SURPASS_REWARD");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 7001,
                "achievement_id": window.surpassData.id,
                "double": window.getDoubleSurpassReward
            }, function(response) {
                $('.network-loading').addClass('hidden');
                if (response.status == 'success') {
                    gameData.score_info.cash = response.data.cash
                    gameData.score_info.worth = response.data.total_property
                    gameData.score_info.crystal = response.data.diamond
                    ModalActions.updateInfoBox();
                    _modalState.mask = false;
                    _modalState.surpass = false;
                    ModalStore.emitChange("surpass");
                } else {
                    alert(response.msg)
                }
            });
            break;
        default:
            // pass
    }
});

module.exports = ModalStore;
