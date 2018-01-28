var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');

var AppActions = {
    collectMoney: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.COLLECT_MONEY
        });
    },
    updateCollectMoney: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.UPDATE_COLLECT_MONEY
        });
    }
};

module.exports = AppActions;
