var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');

var AppActions = {
    goToSalePanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.GO_TO_SALE_PANEL,
        });
    },
    RankingPlayWithFriend: function(friend_id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.RANKING_PLAY_WITH_FRIEND,
            friend_id: friend_id
        });
    },
    showProvinceRank: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_PROVINCE_RANK,
        });
    },
    showNationalRank: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_NATIONAL_RANK,
        });
    },
    ProcessPunishment: function(id, type) {
        AppDispatcher.dispatch({
            actionType: AppConstants.PROCESS_PUNISHMENT,
            id: id,
            type: type
        });
    },
    shareWeiXin: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHARE_WEIXIN
        });
    },
    GetEventsReward: function(id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.GET_EVENTS_REWARD,
            id: id
        });
    },
    GetAchievementsReward: function(id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.GET_ACHIEVEMENTS_REWARD,
            id: id
        });
    },
    buySorceryItem: function(id) {
        AppDispatcher.dispatch({
            actionType: AppConstants.BUY_SORCERYITEM,
            id: id
        });
    },
    showConfirmAlert: function(cost, name, id, type) {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_CONFIRM_ALERT,
            cost: cost,
            name: name,
            id: id,
            type: type
        });
    },
    orderSomeThing: function(data) {
        AppDispatcher.dispatch({
            actionType: AppConstants.ORDER_SOMETHING,
            data: data
        });
    },
    showBusinessPanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_BUSINESS_PANEL
        });
    },
    showSorceryPanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_SORCERY_PANEL
        });
    },
    showSalePanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_SALE_PANEL
        });
    },
    showRankPanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_RANK_PANEL
        });
    },
    showNoticePanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_NOTICE_PANEL
        });
    },
    showLandmarkPanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_LANDMARK_PANEL
        });
    },
    showEventPanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_EVENT_PANEL
        });
    },
    closeRankPanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CLOSE_RANK_PANEL
        });
    },
    closePanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CLOSE_PANEL
        });
    },
    closePunishmentPanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.CLOSE_PUNISHMENT_PANEL
        });
    }
};

module.exports = AppActions;
