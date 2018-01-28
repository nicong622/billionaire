var React = require('react');
var Utils = require('../../utils/utils');
var InfoBoxActions = require('../../actions/info-actions');
var PanelActions = require('../../actions/panel-actions');

var ScoreInfo = React.createClass({
    _onTapThreat: function() {
        log("click threat in info box")
        if (window.topTouchEnable) {
            InfoBoxActions.toggleThreatModal();    
        }
    },
    componentDidUpdate: function() {
        if (this.props.data.threat <= 0) {
            $('.scoreItem-4').addClass('gray')
        } else {
            $('.scoreItem-4').removeClass('gray')
        };
        var worthValue = Utils.numberToShort(this.props.data.worth);
        var cashValue = Utils.numberToShort(this.props.data.cash);
        if (typeof worthValue === 'number') {
            _worthValue = worthValue
        } else {
            _worthValue = worthValue.slice(0,-1)
        }
        if (typeof cashValue === 'number') {
            _cashValue = cashValue
        } else {
            _cashValue = cashValue.slice(0,-1)
        }
        window.worthValue.update(_worthValue);
        window.cashValue.update(_cashValue);
        if (typeof worthValue !== 'number') {
            $('#worthValueUnit').text(worthValue.slice(-1))
        } else {
            $('#worthValueUnit').text('')
        }
        if (typeof cashValue !== 'number') {
            $('#cashValueUnit').text(cashValue.slice(-1))
        } else {
            $('#cashValueUnit').text('')
        }
    },
    componentDidMount: function() {
        if (this.props.data.threat <= 0) {
            $('.scoreItem-4').addClass('gray')
        } else {
            $('.scoreItem-4').removeClass('gray')
        };
        var options = {
            useEasing : true, 
            useGrouping : true, 
            separator : '', 
            decimal : '.', 
            prefix : '', 
            suffix : '' 
        };
        var worthValue = Utils.numberToShort(this.props.data.worth);
        var cashValue = Utils.numberToShort(this.props.data.cash);
        if (typeof worthValue === 'number') {
            _worthValue = worthValue
        } else {
            _worthValue = worthValue.slice(0,-1)
        }
        if (typeof cashValue === 'number') {
            _cashValue = cashValue
        } else {
            _cashValue = cashValue.slice(0,-1)
        }
        window.worthValue = new CountUp("worthValue", _worthValue, _worthValue, 2, 2.5, options);
        window.cashValue = new CountUp("cashValue", _cashValue, _cashValue, 2, 2.5, options);
        if (typeof worthValue !== 'number') {
            $('#worthValueUnit').text(worthValue.slice(-1))
        } else {
            $('#worthValueUnit').text('')
        }
        if (typeof cashValue !== 'number') {
            $('#cashValueUnit').text(cashValue.slice(-1))
        } else {
            $('#cashValueUnit').text('')
        }
    },
    _onTapScore: function() {
        log('click scoreItem in userInfo box')
        if (window.topTouchEnable) {
            PanelActions.showSalePanel();
        }
    },
    render: function() {
        var crystalValue = Utils.numberToShort(this.props.data.crystal);
        return (
            <div className="scoreInfo">
                <div className="scoreItem-1">
                    <span className="worthTitle">你的资产</span>
                    <span className="worthIcon"></span>
                    <span className="worthValue">
                        <span id="worthValue"></span>
                        <span id="worthValueUnit"></span>
                    </span>
                </div>
                <div className="scoreItem-2" onTouchTap={this._onTapScore}>
                    <span className="crystalTitle">钻石</span>
                    <span className="crystalIcon"></span>
                    <span className="crystalValue">{crystalValue}</span>
                </div>
                <div className="scoreItem-3" onTouchTap={this._onTapScore}>
                    <span className="cashTitle">可用的现金</span>
                    <span className="cashIcon"></span>
                    <span className="cashValue">
                        <span id="cashValue"></span>
                        <span id="cashValueUnit"></span>
                    </span>
                </div>
                <div className="scoreItem-4" onTouchTap={this._onTapThreat}>
                    <span className="threatTitle">威胁值</span>
                    <span className="threatIcon"></span>
                    <span className="threatValue">{this.props.data.threat}%</span>
                </div>
            </div>
        );
    }
});

module.exports = ScoreInfo;
