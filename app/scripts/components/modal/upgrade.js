var React = require('react');
var ModalStore = require('../../stores/modal-store');
var ModalActions = require('../../actions/modal-actions');
var BuildingBoxActions = require('../../actions/building-box-actions');
var Utils = require('../../utils/utils');

function getState() {
    return ModalStore.getModalState()
}

var UpgradeModal = React.createClass({
    getInitialState: function() {
        return {
            upgrade: false,
            data: {}
        }
    },
    componentWillUnmount: function() {
        ModalStore.removeChangeListener("upgrade", this._update);
    },
    componentDidMount: function() {
        ModalStore.addChangeListener("upgrade", this._update);
    },
    componentDidUpdate: function() {
        $('.ModalMask').toggleClass('ModalMaskShow')
    },
    _display: function() {
        if (this.state.upgrade) {
            return "NormalModalShow"
        } else {
            return ""
        }
    },
    _update: function() {
        log("update upgrade modal state");
        $('.network-loading').addClass('hidden');
        this.setState(getState());
    },
    _onTapClose: function() {
        log("click close in upgrade modal")
        ModalActions.closeUpgradeModal();
    },
    _imagesId: function() {
        if (gameData.building_info.length > 0 && activeBuildingIndex < gameData.building_info.length) {
            return gameData.building_info[activeBuildingIndex].id    
        } else {
            return '1'
        }
    },
    _updateOnTap: function() {
        log("click upgrade Confirm in upgrade modal");
        BuildingBoxActions.upgradeBuilding();
    },
    render: function() {
        return (
            <div className="UpgradeModal">
                <div className={"NormalModal ModalBorderGreen " + this._display()}>
                    <span className="NormalModalTitle">升级到 LV.{this.state.data.level}</span>
                    <span className="NormalModalCloseGreen" onTouchTap={this._onTapClose}></span>
                    <img className="ModalBuilding" src={cdn+"images/building/" + this._imagesId() + ".png"} />
                    <div className="UpgradeModalNote">
                        <p className="UpgradeModalNoteTitle">{this.state.data.name}</p>
                        <ul className="left">
                            <li>收益：￥{ !!gameData.building_info[0] ? Utils.numberToShort(parseInt(gameData.building_info[activeBuildingIndex].income)) : ''}/分钟</li>
                            <li>最大累计收益：￥{ !!gameData.building_info[0] ? Utils.numberToShort(gameData.building_info[activeBuildingIndex].maxincome) : ''}</li>
                            <li className="RedText">威胁值：{ !!gameData.building_info[0] ? gameData.building_info[activeBuildingIndex].threaten : ''}%</li>
                            <li>建造时间：{this.state.data.time}</li>
                        </ul>
                        <ul className="right">
                            <li>￥{Utils.numberToShort(this.state.data.income)}/分钟</li>
                            <li>￥{Utils.numberToShort(this.state.data.maxincome)}</li>
                            <li> {this.state.data.threaten}%</li>
                        </ul>
                    </div>
                    <div className="UpgradeModalButton NormalModalButton ModalButtonGreen" onTouchTap={this._updateOnTap}>
                        <p className="UpgradeModalButtonText">升级</p>
                        <p className="UpgradeModalButtonNum">{this.state.data.price}</p>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = UpgradeModal;
