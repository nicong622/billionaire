var React = require('react');
var PanelActions = require('../../actions/panel-actions');

var Achievements = React.createClass({

    _onTapAchievementsItemBtn: function() {
        log("click achievements btn")
        if (this.props.data.status == 1) {
            PanelActions.GetAchievementsReward(this.props.data.id)
            $(this.getDOMNode()).find('.AchievementsItemBtn').text("已领取").css('backgroundColor', '#A8A9A9')
        }
    },
    render: function() {
        style = {
            width: this.props.data.progress/this.props.data.condition*100 + "%"
        }
        if (this.props.data.status == 2) {
            var rewardStyle = {
                backgroundColor: "#A8A9A9"
            }
            var reward = "已领取"
        } else if (this.props.data.status == 0){
            var rewardStyle = {
                backgroundColor: "#A8A9A9"
            }
            var reward = "继续努力"
        } else {
            var rewardStyle = {}
            var reward = "领取奖励"
        }
        return (
            <div className="AchievementsItem">
                <img src={cdn+"images/achievement/" + this.props.data.id + ".png"}/>
                <p className="AchievementsItemTitle">{this.props.data.title}</p>
                <p className="AchievementsItemText">{this.props.data.descs}</p>
                <div className="AchievementsItemProgress">
                    <span>{this.props.data.progress + "/" + this.props.data.condition}</span>
                    <div style={style}></div>
                </div>
                <div className="AchievementsItemBtn" style={rewardStyle} onTouchTap={this._onTapAchievementsItemBtn}>{reward}</div>
            </div>
        );
    }

});

module.exports = Achievements;
