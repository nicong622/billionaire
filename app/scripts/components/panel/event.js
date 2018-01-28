var React = require('react');
var PanelActions = require('../../actions/panel-actions');

var EventItem = React.createClass({
    componentDidMount: function() {
    },
    _onTapBtn: function() {
        log("click btn in events panel");
        if (this.props.data.status == 1) {
            PanelActions.GetEventsReward(this.props.data.activity_id)
        } else {
            if (this.props.data.activity_id == 1) {
                $.post(hostUrl, JSON.stringify({
                    "cmd": 1103,
                    "activity_id": 1
                }), function(response) {
                    window.location.href = "http://mp.weixin.qq.com/s?__biz=MjM5NjMwOTk0NQ==&mid=400097590&idx=1&sn=479bb9f1fd6cc9b5a6276cc1ff40489d&scene=0#rd"    
                })
            } else if (this.props.data.activity_id == 3) {
                PanelActions.shareWeiXin()
            } else if (this.props.data.activity_id == 5) {
                PanelActions.goToSalePanel()
            }
        }
    },
    _display: function() {
        if (!!this.props.data.title) {
            return ""
        } else {
            return "hidden"
        }
    },
    _gray: function() {
        if (!!this.props.data.title) {
            return ""
        } else {
            return "GrayBackground"
        }
    },
    render: function() {
        var btn
        if (this.props.data.status == 1) {
            btn = "领取奖励"
            var style = {
                color: "#fff"
            }
        } else if (this.props.data.status == 2) {
            var style = {
                backgroundColor: "#bcea2a"
            }
            btn = "已领取"
        } else {
            var style = {
                backgroundColor: "#bcea2a"
            }
            btn = "前往"
        }
        if (this.props.data.cash>0) {
            var cashReward = "cashReward"
        } else {
            var cashReward = ""
        }
        if (this.props.data.diamond > 0) {
            var diamondReward = "diamondReward"
        } else {
            var diamondReward = ''
        }
        return (
            <div className={"EventItem " + this._gray()}>
                <p className={!!this.props.data.title ? "hidden" : "nothing"}>空的</p>
                <p className={"EventItemTitle " + this._display()}>{this.props.data.title}</p>
                <p className={"EventItemText " + this._display()}>{this.props.data.descs}</p>
                <div className={"RewardNote "+ this._display()}>
                    <span className="RewardText">{this.props.data.bigamount ? "可获奖励：大量" : '可获奖励：'}</span>
                    <span className={cashReward}></span>
                    <span className={diamondReward}></span></div>
                <img className={this._display()} src={cdn+"images/activity/" + this.props.data.id + ".png"}/>
                <p className={"ProgressText " + this._display()}>{"剩余次数：" + this.props.data.progress + '/' + this.props.data.times}</p>
                <div className={"EventItemBtn " + this._display()} style={style} onTouchTap={this._onTapBtn}>{btn}</div>
            </div>
        );
    }

});

module.exports = EventItem;
