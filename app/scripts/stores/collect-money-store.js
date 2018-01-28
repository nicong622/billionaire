var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var _CollectMoneyState = gameData.building_info[0];

if (!gameData.building_info[0]) {
    _CollectMoneyState = {};
    _CollectMoneyState.show = false;
    _CollectMoneyState.cash_pool = 1;
    _CollectMoneyState.maxincome = 1;
    _CollectMoneyState.income = 1;
} else {
    _CollectMoneyState.show = gameData.building_info[0].status == 2;
}

var CollectMoneyStore = assign({}, EventEmitter.prototype, {
    getState: function() {
        return _CollectMoneyState;
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
        case AppConstants.UPDATE_COLLECT_MONEY:
            log("handle UPDATE_COLLECT_MONEY");
            if (window.activeBuildingIndex >= gameData.building_info.length) {
                _CollectMoneyState.show = false;
                $('.CreateBuildingAnimation').addClass('hidden')
            } else {
                _CollectMoneyState = gameData.building_info[window.activeBuildingIndex];
                if (_CollectMoneyState.status == 2 || _CollectMoneyState.status == 99) {
                    _CollectMoneyState.show = true;
                    $('.CreateBuildingAnimation').addClass('hidden');
                    if (_CollectMoneyState.cash_pool == _CollectMoneyState.maxincome){
                        $('[class^="cashAnimationWrapper"]').hide()
                    } else {
                        $('[class^="cashAnimationWrapper"]').show()
                    }
                } else if (_CollectMoneyState.status != 2) {
                    $('.CreateBuildingAnimation').removeClass('hidden');
                    _CollectMoneyState.show = false;
                }
            }
            CollectMoneyStore.emitChange();
            break;
        case AppConstants.UPDATE_COLLECT_MONEY_CASH_BOX:
            log("handle UPDATE_COLLECT_MONEY_CASH_BOX");
            _CollectMoneyState.resetCashBox = true;
            CollectMoneyStore.emitChange();
            break;
        case AppConstants.BUILDING_COMPLETE_CONFIRMED:
            log("handle BUILDING_CREATE_COMPLETE from collectMoney");
            if (activeBuildingIndex != gameData.building_info.length && gameData.building_info[activeBuildingIndex].status == 2) {
                log("status is 2");
                _CollectMoneyState = gameData.building_info[activeBuildingIndex];
                _CollectMoneyState.show = true;
                _CollectMoneyState.cash_pool = 1;
                $('.CreateBuildingAnimation').addClass('hidden');
                $('[class^="cashAnimationWrapper"]').show()
            }
            CollectMoneyStore.emitChange();
            break;
        case AppConstants.ADD_LANDMARK:
            log("handle ADD_LANDMARK");
            if (activeBuildingIndex == gameData.building_info.length || gameData.building_info[activeBuildingIndex].status == 2) {
                _CollectMoneyState.show = true;
                _CollectMoneyState.cash_pool = 1;
                $('.CreateBuildingAnimation').addClass('hidden');
            }
            CollectMoneyStore.emitChange();
            break;
        case AppConstants.UPGRADE_BUILDING_START:
            log("handle UPGRADE_BUILDING_START");
            if (gameData.building_info[activeBuildingIndex].status == 1) {
                _CollectMoneyState.show = false;
                $('.CreateBuildingAnimation').removeClass('hidden');
            }
            CollectMoneyStore.emitChange();
            break;
        default:
            // pass
    }
});

module.exports = CollectMoneyStore;
