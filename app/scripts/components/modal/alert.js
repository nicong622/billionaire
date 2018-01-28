var React = require('react');
var ModalStore = require('../../stores/modal-store');
var ModalActions = require('../../actions/modal-actions');
var Utils = require('../../utils/utils');

function getState() {
    return ModalStore.getModalState()
}

var AlertModal = React.createClass({
    getInitialState: function() {
        return {
            alert: false,
            data: {}
        }
    },
    componentDidMount: function() {
        ModalStore.addChangeListener("alert", this._update);
    },
    componentDidUpdate: function() {
        lineHeight = document.querySelector(".alertOk").clientHeight;
        document.querySelector(".alertOk").style.lineHeight = lineHeight + "px";
        document.querySelector(".alertCancel").style.lineHeight = lineHeight + "px";
        if (this.state.action != 'alertHelpText') {
            $('.ModalMask').toggleClass('ModalMaskShow')
        }
    },
    componentWillMount: function() {
        buyBuildingInfo = []
    },
    componentWillUnmount: function() {
        ModalStore.removeChangeListener("alert", this._update);
    },
    _update: function() {
        log("update alert modal state");
        this.setState(getState());
    },
    _display: function() {
        if (this.state.alert) {
            return ""
        } else {
            return "hidden"
        }
    },
    _onTapClose: function() {
        log("click close in alert modal");
        if (this.state.action == 'alertHelpText') {
            $('.ModalMask').toggleClass('ModalMaskShow')
        }
        ModalActions.closeAlertModal();
    },
    _onTapConfirm: function() {
        log("click ok in alert modal");
        if (this.state.action === "order") {
            ModalActions.confirmOrder(this.state.data);
        } else if (this.state.action === "buyBuilding") {
            ModalActions.createNewBuilding();
        } else {
            data = {};
            data.id = this.state.id;
            ModalActions.alertConfirm(this.state.type,data);
        }
    },
    _helpText:function() {
        log('click help icon on alert');
        ModalActions.alertHelpText();
    },
    render: function() {
        var cost;

        if (this.state.action === "order") {
            if (this.state.data.costRMB > 0) {
                cost = "￥" + this.state.data.costRMB
            } else {
                cost = this.state.data.costdiamond + " 钻石"
            }
            if (this.state.data.getcash > 0) {
                name = Utils.numberToShort(this.state.data.getcash);
            } else {
                name = this.state.data.getdiamond
            }
            if (this.state.data.type == 1) {
                name = name + "现金"
            } else {
                name = name + "钻石"
            }
        } else if (this.state.action === "buyBuilding") {
            if (this.state.data.diamond == 0) {
                cost = "￥ " + buyBuildingInfo.price;
            } else {
                cost = this.state.data.diamond + " 钻石";
            }
            name = buyBuildingInfo.name;
        } else if (this.state.action === "buyLandMark") {
            if (this.state.data.diamond == 0) {
                cost = "￥ " + this.state.cost;
            } else {
                cost = this.state.data.diamond + " 钻石";
            }
            name = buyBuildingInfo.name;
        } else {
            cost = this.state.cost;
            name = this.state.name;
        }

        if (this.state.action == 'alertNeedMoreMoney') {
            var _alertTextDisplay = 'hidden';
            var _alertOkDisplay = 'hidden';
            var _alertCancelDisplay = 'hidden';
            var alertTextRedDisplay = '';
            var _buybuybuyText = '';
            var _ruleTextDisplay = 'hidden';
            var _helpIconDisplay = '';
            var _currentLimitTextDisplay = 'hidden'
        } else if (this.state.action == 'alertHelpText') {
            _alertTextDisplay = 'hidden';
            _alertOkDisplay = 'hidden';
            _alertCancelDisplay = 'hidden';
            alertTextRedDisplay = 'alertTextRedSmall';
            _buybuybuyText = 'hidden';
            _ruleTextDisplay = '';
            _helpIconDisplay = 'hidden';
            _currentLimitTextDisplay = '';
        } else {
            _alertTextDisplay = '';
            _alertOkDisplay = '';
            _alertCancelDisplay = '';
            alertTextRedDisplay = 'hidden';
            _buybuybuyText = 'hidden';
            _ruleTextDisplay = 'hidden';
            _helpIconDisplay = 'hidden';
            _currentLimitTextDisplay = 'hidden'
        }
        return (
            <div className={"AlertModal " + this._display()}>
                <div className="alertBox">
                    <div className="alertClose" onTouchTap={this._onTapClose}><span></span></div>
                    <span className={"alertText "+_alertTextDisplay}>{"是否花费 " + Utils.numberToShort(cost)}<br/>{"购买" + name}</span>
                    <span className={"alertTextRed "+alertTextRedDisplay}>已达同时建造上限</span>
                    <span className={"buybuybuyText "+_buybuybuyText}>付费满<span className="GreenText">{!!this.state.data.rmb?this.state.data.rmb:''}</span>元将提高<br/>同时建造上限至<span className="GreenText">{!!this.state.data.limit?this.state.data.limit:''}</span></span>
                    <table className={"ruleText "+_ruleTextDisplay}>
                        <tbody>
                            <tr>
                                <th>付费总额达<span className="GreenText">6</span>元</th>
                                <th><span className="BrownText">上限 → </span><span className="GreenText">2</span></th>
                            </tr>
                            <tr>
                                <td>付费总额达<span className="GreenText">30</span>元</td>
                                <td><span className="BrownText">上限 → </span><span className="GreenText">3</span></td>
                            </tr>
                            <tr>
                                <td>付费总额达<span className="GreenText">60</span>元</td>
                                <td><span className="BrownText">上限 → </span><span className="GreenText">4</span></td>
                            </tr>
                            <tr>
                                <td>付费总额达<span className="GreenText">128</span>元</td>
                                <td><span className="BrownText">上限 → </span><span className="GreenText">5</span></td>
                            </tr>
                            <tr>
                                <td>付费总额达<span className="GreenText">648</span>元</td>
                                <td><span className="BrownText">上限 → </span><span className="GreenText">无限</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <p className={"CurrentLimitText "+_currentLimitTextDisplay}>当前限额：<span className="GreenText">{window.currentLimit}</span></p>
                    <div className={"alertOk "+_alertOkDisplay} onTouchTap={this._onTapConfirm}>确定</div>
                    <div className={"alertCancel " + _alertCancelDisplay} onTouchTap={this._onTapClose}>取消</div>
                    <div className={"HelpIcon "+_helpIconDisplay} onTouchTap={this._helpText}></div>
                </div>
            </div>
        );
    }

});

module.exports = AlertModal;
