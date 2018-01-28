var React = require('react');
var InfoBoxActions = require('../../actions/info-actions');

var UserInfo = React.createClass({
    _onTapUserInfo: function() {
        log("click user in info box")
        if (window.topTouchEnable) {
            InfoBoxActions.showAchievementsPanel();    
        }
    },
    render: function() {
        return (
            <div className="userInfo" onTouchTap={this._onTapUserInfo}>
                <img className="avatar" src={this.props.data.pic_link}></img>
                <span className="userName">{this.props.data.nick_name}</span>
                <span className="userRank">排名：{this.props.data.rank}</span>
            </div>
        );
    }
});

module.exports = UserInfo;
