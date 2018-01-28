var React = require('react');
var ModalActions = require('../../actions/modal-actions');
var Utils = require('../../utils/utils');

var BusinessItem = React.createClass({
    _buyBuilding: function (){
        log('click buy building ' + this.props.data.id + ' in business panel');
        var building_in_progress = 0;
        for (var i = 0; i < gameData.building_info.length; i++) {
            if (gameData.building_info[i].status !=2 ) {
                building_in_progress += 1;
            }
        }
        window.buyBuildingInfo = this.props.data;
        if (gameData.user_info.vip_exper >= 648) {
            ModalActions.buyBuilding()
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
            ModalActions.buyBuilding()
        }
    },
    _mask: function() {
        if (gameData.score_info.worth>=this.props.data.condition) {
            return ''
        } else if (!this.props.data.condition) {
            return ''
        } else {
            return (
                <div className="lockMask">
                    <p className="lockMaskTitle">{this.props.data.name}</p>
                    <img src={cdn+"images/lock-buliding.png"}/>
                    <div className="UnlockRule">
                        <p>解锁条件：</p>
                        <p>{'资产>￥'+Utils.numberToShort(this.props.data.condition)}</p>
                    </div>
                </div>
            )
        }
    },
    _display: function() {
        if (!!this.props.data.name) {
            return ''
        } else {
            return 'hidden'
        }
    },
    render: function() {
        return (
            <div className={"BusinessItem " + this._display()}>
                <p className="BusinessItemTitle">{this.props.data.name}</p>
                <img src={cdn+"images/building/" + this.props.data.id + ".png"}/>
                <p className="BusinessItemText">收益：￥{Utils.numberToShort(this.props.data.income)}/分钟</p>
                <p className="BusinessItemText">最大累计收益：￥{Utils.numberToShort(this.props.data.maxincome)}</p>
                <p className="BusinessItemText">建造时间：{this.props.data.time}m</p>
                <p className="RedText BusinessItemText">威胁值：{this.props.data.threaten}%</p>
                <div className={this.props.data.price ? "BusinessItemBtn": "BusinessItemBtnDiamondIcon"} onTouchTap={this._buyBuilding}>{Utils.numberToShort(this.props.data.price||this.props.data.diamond)}</div>
                {this._mask()}
            </div>
        );
    }

});

module.exports = BusinessItem;
