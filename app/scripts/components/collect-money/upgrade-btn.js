var React = require('react');
var ModalActions = require('../../actions/modal-actions');

var UpgradeBtn = React.createClass({
    _onTap: function() {
        log("click upgrade btn");
        var building_in_progress = 0;
        for (var i = 0; i < gameData.building_info.length; i++) {
            // status = 99 是收获收获造成了，为的是暂停归零重新计时的操作。
            if (gameData.building_info[i].status !=2 && gameData.building_info[i].status != 99) {
                building_in_progress += 1;
            }
        }
        if (gameData.user_info.vip_exper >= 648) {
            ModalActions.showUpgradeModal();
        } else if (gameData.user_info.vip_exper >= 128 && gameData.user_info.vip_exper < 648 && building_in_progress == 5) {
            ModalActions.alertNeedMoreMoney(648,'无限');
            window.currentLimit = '5';
        } else if (gameData.user_info.vip_exper >= 60 && gameData.user_info.vip_exper < 128 && building_in_progress == 4) {
            ModalActions.alertNeedMoreMoney(128, 5);
            window.currentLimit = '4';
        } else if (gameData.user_info.vip_exper >= 30 && gameData.user_info.vip_exper < 60 && building_in_progress == 3) {
            ModalActions.alertNeedMoreMoney(60, 4);
            window.currentLimit = '3';
        } else if (gameData.user_info.vip_exper >= 6 && gameData.user_info.vip_exper < 30 && building_in_progress == 2) {
            ModalActions.alertNeedMoreMoney(30, 3);
            window.currentLimit = '2';
        } else if (gameData.user_info.vip_exper < 6 && building_in_progress == 1){
            ModalActions.alertNeedMoreMoney(6, 2);
            window.currentLimit = '1';
        } else {
            ModalActions.showUpgradeModal();
        }
    },
    render: function() {
        var left = "";
        var landmark = "";
        if (this.props.data.maxincome == 0) {
            left = "UpgradeBtn-left "
        } else if (!!!gameData.building_info[window.activeBuildingIndex]) {
            landmark = "hidden"
        } else if (gameData.building_info[window.activeBuildingIndex].type == "landmark" || gameData.building_info[window.activeBuildingIndex].sale == 0) {
            landmark = "hidden"
        }
        return (
            <div className={"UpgradeBtn " + left + landmark} onTouchTap={this._onTap}/>
        );
    }

});

module.exports = UpgradeBtn;
