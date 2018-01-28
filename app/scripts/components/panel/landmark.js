var React = require('react');
var Utils = require('../../utils/utils');
var PanelActions = require('../../actions/panel-actions');

var LandmarkItem = React.createClass({
    componentDidMount: function() {
    },
    _landmarkGetBtn: function() {
        log("click 抢购 btn in landmark panel "+ this.props.data.landmark_id)
        window.buyBuildingInfo = this.props.data
        PanelActions.showConfirmAlert(Utils.numberToShort(this.props.data.money||this.props.data.diamond),this.title, this.props.data.landmark_id, "landmark")
    },
    render: function() {
        this.title = this.props.data.name;
        var id = this.props.data.landmark_id
        var income = Utils.numberToShort(this.props.data.income);
        var maxincome = Utils.numberToShort(this.props.data.maxincome);
        var number = Utils.numberToShort(this.props.data.money||this.props.data.diamond);
        if (!!this.props.data.charge.cash) {
            charge = '￥'+ Utils.numberToShort(this.props.data.charge.cash)
        } else {
            charge = '钻石 ' + Utils.numberToShort(this.props.data.charge.diamond)
        }
        if (!!this.props.data.owner.player_info) {
            user_name = this.props.data.owner.player_info.nickname; 
            img_url = this.props.data.owner.player_info.headimgurl;
            displayOwner = ''
        } else {
            user_name = ''
            img_url = ''
            displayOwner = "hidden"
        }
        var now = Date.now()/1000;
        if (now<this.props.data.time) {
            number = (this.props.data.time-now).toString().toHHMMSS()
            if (!!this.props.data.diamond) {
                var _iconDisplay = "LandmarkItemBtnDiamond"
                number = " "+number
            }
        } else {
            if (!!this.props.data.diamond) {
                var _iconDisplay = "LandmarkItemBtnDiamond"
                number = " "+number
            } else {
                number = "收购 ￥" +number
            }
        }
        return (
            <div className="LandmarkItem">
                <p className="LandmarkItemTitle">{this.title}</p>
                <img src={cdn+"images/landmark/" + id + ".png"}/>
                <div className={"LandmarkItemOwner " + displayOwner}>
                    <div className="LandmarkItemOwnerTitle">拥有者</div>
                    <img src={img_url} className="LandmarkItemOwnerImage" />
                    <div className="LandmarkItemOwnerUserName">{user_name}</div>
                </div>
                <div className="LandmarkItemNote">
                    <p className="LandmarkItemText">收益：￥{income}/分钟</p>
                    <p className="LandmarkItemText">最大收益：￥{maxincome}</p>
                    <p className="LandmarkItemText">手续费：{charge}</p>
                </div>
                <div className={"LandmarkItemBtn " + _iconDisplay} onTouchTap={this._landmarkGetBtn}>{number}</div>
            </div>
        );
    }

});

module.exports = LandmarkItem;
