var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');

var AppActions = {
    toggleThreatModal: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.TOGGLE_THREAT_MODAL
        });
    },
    showAchievementsPanel: function() {
        AppDispatcher.dispatch({
            actionType: AppConstants.SHOW_ACHIEVEMENTS_PANEL
        });
    }
};

module.exports = AppActions;
