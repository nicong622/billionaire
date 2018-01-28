var React = require('react');
var CollectMoneyActions = require('../../actions/collect-money-actions');

var CollectBar = React.createClass({
    _onTapCollect: function() {
        log("click collect bar in collect money");
        window.building_info[activeBuildingIndex].status = 99;
        CollectMoneyActions.collectMoney();
    },
    componentDidMount: function() {
    },
    _display: function() {
        if (this.props.data.maxincome == 0) {
            return "hidden"
        } else {
            return ""
        }
    },
    render: function() {
        return (
            <div className={this._display()}>
                <div className="CollectBar" onTouchTap={this._onTapCollect}/>
                <span id="BuildingMoney" className="BuildingMoney" onTouchTap={this._onTapCollect}>{parseInt(this.props.data.cash_pool)}</span>
            </div>
        );
    }

});

module.exports = CollectBar;
