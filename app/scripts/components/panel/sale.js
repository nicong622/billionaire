var React = require('react');
var Utils = require('../../utils/utils');
var PanelActions = require('../../actions/panel-actions');

var SaleItem = React.createClass({
    componentDidMount: function() {
        // table 布局不能为空。单数最后一个隐藏
        $('.SaleItem').eq(-1).hide()
    },
    _label: function() {
        // #id:道具序号
        // #type:道具类型（1为钻石道具，2为现金道具）
        // #getcash:获得现金
        // #getdiamond:获得钻石
        // #costdiamon:花费的钻石
        // #costRMB:花费现实货币（人民币）
        // #effect:道具状态（1为火爆，2为超值，0为不显示）
        // #onsale:多余赠送（单位%）
        // #firstaward:首充奖励（数字为倍数）
        if (this.props.data.effect == 1 && this.props.data.firstaward == 0) {
            return ""
        } else if (this.props.data.effect == 2) {
            return <span className="SaleItemLabel">超值</span>
        } else if (this.props.data.firstaward > 0){
            return <span className="SaleItemLabel">首充<span className="SaleItemLabel2">{this.props.data.firstaward + "倍"}</span></span>
        } else {
            return ""
        }
    },
    _onsale: function() {
        if (this.props.data.onsale > 0) {
            return <p className="SaleItemText">{"多送 " + this.props.data.onsale+ "%"}</p>
        } else {
            return ""
        }
    },
    _type: function() {
        if (this.props.data.type == 1) {
            return "现金"
        } else {
            return "钻石"
        }
    },
    _cost: function() {
        if (this.props.data.costRMB > 0) {
            return "￥" + this.props.data.costRMB
        } else {
            return this.props.data.costdiamond
        }
    },
    _hot: function() {
        if (this.props.data.effect == 1) {
            return ""
        } else {
            return "hidden"
        }
    },
    _getThing: function() {
        if (this.props.data.getcash > 0) {
            return Utils.numberToShort(this.props.data.getcash);
        } else {
            return this.props.data.getdiamond
        }
    },
    _SaleItemBtnOnTap: function() {
        log("click SaleItemBtn in SaleItem " + this.props.data.id);
        PanelActions.orderSomeThing(this.props.data)
    },
    render: function() {
        return (
            <div className="SaleItem">
                {this._label()}
                <div className={"hotIcon " + this._hot()}></div>
                <img src={cdn+"images/sale/" + this.props.data.id + ".png"}/>
                {this._onsale()}
                <div className="SaleItemBtn" onTouchTap={this._SaleItemBtnOnTap}>
                    <div className="SaleItemBtnLeft">
                        <span>{this._getThing()}</span>
                        <span>{this._type()}</span>
                    </div>
                    <div className="SaleItemBtnRight ">
                        <span className={this.props.data.type == 1 ? "diamondIcon" : ""}>{this._cost()}</span>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = SaleItem;
