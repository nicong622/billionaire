var React = require('react');
var Utils = require('../../utils/utils');

var BuildingInfo = React.createClass({
    render: function() {
        if (this.props.data.maxincome == 0) {
            var display = "hidden"
            var LevelThreatClass = "LevelThreat-top"
        } else if (this.props.data.type == 'landmark') {
            var LevelThreatClass = 'hidden';
            var display = ""
        } else {
            var display = ""
            var LevelThreatClass = ""
        }
        return (
            <div className="BuildingInfo">
                <div className="LevelIndex"><span>{this.props.data.level}</span></div>
                <div className="LevelName">{this.props.data.name}</div>
                <div className={"LevelProfitSpeed " + display}>收益：¥{Utils.numberToShort(this.props.data.income)}/分钟</div>
                <div className={"LevelMaxProfit " + display}>最大累计收益：¥{Utils.numberToShort(this.props.data.maxincome)}</div>
                <div className={"LevelThreat "+ LevelThreatClass}>威胁值：{this.props.data.threaten}%</div>
            </div>
        );
    }

});

module.exports = BuildingInfo;
