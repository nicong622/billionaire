var React = require('react');
var Utils = require('../../utils/utils');
var Actions = require('../../actions/panel-actions');

var RankingListItem = React.createClass({
    clickBtn: function() {
        log("click btn in rankinglist");
        Actions.RankingPlayWithFriend(this.props.data.openid);
        $(this.getDOMNode()).find('.RankingListItemBtn').addClass('hidden')
    },
    _display: function () {
        if (this.props.data.is_robot == true || this.props.data.already_ask == true) {
            return "hidden"
        } else {
            return ""
        }
    },
    render: function() {
        if (!this.props.data) {
            log("add ranking line");
            return (
                <div className="RankingListItem RankingListItem-line">······</div>
            );
        } else {
            if (this.props.data.headimgurl.length < 30) {
                var headimgurl = cdn + "images/npc/" + this.props.data.headimgurl + ".jpg"
            } else {
                headimgurl = this.props.data.headimgurl;
            }
            return (
                <div className="RankingListItem" style={this.props.data.style}>
                    <span className={"RankingListItemNumber Number" + this.props.data.number} >{this.props.data.numberText}</span>
                    <img src={headimgurl} />
                    <p className="RankingListItemText">
                        <span className="rankingListNickName">{this.props.data.nickname}</span>
                        <br />
                        <span className="Money">￥{Utils.numberToShort(this.props.data.total_property)}</span>
                    </p>
                    <span className={"RankingListItemBtn " + this._display()} style={this.props.data.btnStyle} onTouchTap={this.clickBtn}>{this.props.data.btnText}</span>
                </div>
            );
        }
    }

});

module.exports = RankingListItem;
