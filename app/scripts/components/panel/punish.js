var React = require('react');
var PanelActions = require('../../actions/panel-actions');

var Punish = React.createClass({
    _onTap1: function() {
        log("click first btn in punishment");
        PanelActions.ProcessPunishment(this.props.data.id,0) 
    },
    _onTap2: function() {
        log("click 2 btn in punishment");
        PanelActions.ProcessPunishment(this.props.data.id,1) 
    },
    _onTapHelp: function() {
        log("click help btn in punishment");
        PanelActions.shareWeiXin()
    },
    componentDidMount: function() {
        setInterval(function() {
            if (!!window.punishment) {
                $.post(hostUrl, JSON.stringify({
                    "cmd": 1000
                }), function(response) {
                    if (!!response.data.status) {
                        window.punishment = false;
                        PanelActions.closePunishmentPanel();
                    }
                })
            }
        },20*1000)
    },
    render: function() {
        if (!!this.props.data.name) {
            var _display = ""
            window.topTouchEnable = false;
            window.punishment = true
        }else {
            var _display = "hidden";
            this.props.data.type = 1;
            window.punishment = false;
        }
        if (this.props.data.type == 1) {
            var text = "缴纳罚金 ￥" + parseInt(this.props.data.loss * gameData.score_info.cash / 100)
        } else {
            var text = "接受惩罚"
            var PunishImg = "PunishImg"
        }
        return (
            <div className={"Punish " + _display}>
                <img className={PunishImg} src={cdn+"images/punish/" + this.props.data.type + ".png"} />
                <p className="PunishTitle">{this.props.data.name}</p>
                <p className="PunishText">{this.props.data.describe}</p>
                <div className="PunishForfeit" onTouchTap={this._onTap1}>{text}</div>
                <div className="PunishDiamond" onTouchTap={this._onTap2}>{this.props.data.diamond}</div>
                <div className="PunishCallHelp" onTouchTap={this._onTapHelp}>请求好友帮忙<br/>O(∩_∩)O</div>
            </div>
        );
    }

});

module.exports = Punish;
