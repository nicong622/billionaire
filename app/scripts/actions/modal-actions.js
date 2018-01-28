var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');

var AppActions = {
    showSurpassModal: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_SURPASS_MODAL
        });
    },
    alertHelpText: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.ALERT_HELP_TEXT
        });
    },
    alertNeedMoreMoney: function(rmb, limit) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ALERT_NEED_MORE_MONEY,
            rmb: rmb,
            limit: limit
        });
    },
    alertConfirm: function(type, data) {
        if (type == "landmark") {
            AppDispatcher.dispatch({
                actionType: AppConstants.buyLandMark,
                id: data.id
            });
        }
    },
    confirmOrder: function(data) {
        AppDispatcher.dispatch({
            actionType: AppConstants.CONFIRM_ORDER,
            data: data
        });
    },
    buyBuilding: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.BUY_BUILDING
        });
    },
    closeAlertModal: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CLOSE_ALERT_MODAL
        });
    },
    createNewBuilding: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CREATE_NEW_BUILDING
        });
    },
    closeThreatModal: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CLOSE_THREAT_MODAL
        });
    },
    showUpgradeModal: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_UPGRADE_MODAL
        });
    },
    closeUpgradeModal: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CLOSE_UPGRADE_MODAL
        });
    },
    closeSurpassModal: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CLOSE_SURPASS_MODAL
        });
    },
    getSurpassReward: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.GET_SURPASS_REWARD
        });
    },
    showSaleModal: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_SALE_MODAL
        });
    },
    closeSaleModal: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CLOSE_SALE_MODAL
        });
    },
    saleBuilding: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SALE_BUILDING
        });
    },
    updateInfoBox: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.UPDATE_INFO_BOX
        });
    }
};

module.exports = AppActions;
