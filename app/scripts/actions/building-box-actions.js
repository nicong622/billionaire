var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var Utils = require('../utils/utils');

var AppActions = {
    slideToFullBuilding: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SLIDE_TO_FULL_BUILDING
        });
    },
    buildingSlideChange: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.UPDATE_COLLECT_MONEY
        });
    },
    createNewBuilding: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_BUSINESS_PANEL
        });
    },
    upgradeBuilding: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.UPGRADE_BUILDING
        });
    },
    buildingCreateComplete: function(buildingId, index) {
        AppDispatcher.dispatch({
            actionType: AppConstants.BUILDING_CREATE_COMPLETE,
            buildingId: buildingId,
            click_times: Utils.getClickTimes(buildingId),
            index: index
        });
    },
    buildingCompleteNow: function(buildingId) {
        AppDispatcher.dispatch({
            actionType: AppConstants.BUILDING_COMPLETE_NOW,
            buildingId: buildingId
        });
    },
    buildingCompleteConfirmed:function(){
        AppDispatcher.dispatch({
            actionType: AppConstants.BUILDING_COMPLETE_CONFIRMED
        })
    }
};

module.exports = AppActions;
