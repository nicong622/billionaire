var React = require('react');
var PanelStore = require('../../stores/panel-store');
var PanelActions = require('../../actions/panel-actions');
var BuildingBoxActions = require('../../actions/building-box-actions');

var ToolBar = React.createClass({
    _onTapBusiness: function() {
        log("click Business toolBar btn")
        PanelActions.showBusinessPanel();
    },
    _onTapSorcery: function() {
        log("click Sorcery toolBar btn")
        PanelActions.showSorceryPanel();
    },
    _onTapSale: function() {
        log("click Sale toolBar btn")
        PanelActions.showSalePanel();
    },
    _onTapRank: function() {
        log("click Rank toolBar btn")
        PanelActions.showRankPanel();
    },
    _onTapNotice: function() {
        log("click notice toolBar btn")
        PanelActions.showNoticePanel();
    },
    _onTapLandmark: function() {
        log("click Landmark toolBar btn")
        PanelActions.showLandmarkPanel();
    },
    _onTapEvent: function() {
        log("click Event toolBar btn")
        PanelActions.showEventPanel();
    },
    _onTapFullAlert: function() {
        log("click FullAlert toolBar btn")
        for (var i = 0; i < gameData.building_info.length; i++) {
            if (gameData.building_info[i].status == 2 && gameData.building_info[i].cash_pool == gameData.building_info[i].maxincome && gameData.building_info[i].maxincome > 0) {
                window.BuildingBoxSwiper.slideTo(i)
                break;
            }
        };
    },
    componentDidMount: function() {

    },
    render: function() {
        return (
            <div className="toolBar">
                <span className="business" onTouchTap={this._onTapBusiness}></span>
                <span className="sorcery" onTouchTap={this._onTapSorcery}></span>
                <span className="sale" onTouchTap={this._onTapSale}></span>
                <span className="rank" onTouchTap={this._onTapRank}></span>
                <span className={gameData.new_message ? "notice newMsg":"notice"} onTouchTap={this._onTapNotice}></span>
                <span className="landmark" onTouchTap={this._onTapLandmark}></span>
                <span className={gameData.complete_activity ? "event newMsg":"event"} onTouchTap={this._onTapEvent}></span>
                <span className="fullAlert hidden" onTouchTap={this._onTapFullAlert}></span>
            </div>
        );
    }

});

module.exports = ToolBar;
