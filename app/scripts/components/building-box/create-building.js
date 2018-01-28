var React = require('react');
var BuildingBoxStore = require('../../stores/building-box-store');
var BuildingBoxActions = require('../../actions/building-box-actions');
var Utils = require('../../utils/utils');

var createBuilding = React.createClass({

    componentDidMount: function (){
    },
    _speedUp: function (){
        log("click speed up in building constructing");
        //var building_info = gameData.building_info;
        building_info[activeBuildingIndex].time_remaining -= gameData.props[0].tap_speed / 60;
        if(building_info[activeBuildingIndex].time_remaining < 1 / 60){
            $('.network-loading').removeClass('hidden');
            building_info[activeBuildingIndex].time_remaining = 0;
            BuildingBoxActions.buildingCreateComplete(building_info[activeBuildingIndex].id, activeBuildingIndex);
        }
        building_info[activeBuildingIndex].time_build_end -= gameData.props[0].tap_speed;
        // 保存到localStorage
        localStorage.setItem('billionaire-building-end-' + gameData.user_info.openid + '-' + building_info[activeBuildingIndex].id,
            building_info[activeBuildingIndex].time_build_end);
        //记录点击的次数
        Utils.speedUpOnceMore(building_info[activeBuildingIndex].id);

        $('.Remaining>div').css('width', building_info[activeBuildingIndex].time_remaining / building_info[activeBuildingIndex].time * 100 + "%");
        $('.Remaining>span').html(parseInt(building_info[activeBuildingIndex].time_remaining * 60) + "s");
        $('.BuildingCompleteNowBtn>.Cost').html(Math.ceil(1 + building_info[activeBuildingIndex].time_remaining))
    },
    _completeNow: function (){
        log("click completeNow btn in building constructing");
        BuildingBoxActions.buildingCompleteNow(this.props.data.id)
    },
    render: function (){
        if(this.props.data.status == 1){
            var createNewDisplay = 'hidden';
            var updateDisplay = ''
        } else{
            createNewDisplay = '';
            updateDisplay = 'hidden'
        }
        var style = {
            width: gameData.building_info[activeBuildingIndex].time_remaining / gameData.building_info[activeBuildingIndex].time * 100 + "%"
        };
        return (
            <div className="BuildingBoxCreate">
                <div className="Remaining">
                    <div style={style}></div>
                    <span>{this.props.data.time_remaining ? parseInt(this.props.data.time_remaining * 60) + "s" : '0s'}</span>
                </div>
                <div className="GongDi" onTouchTap={this._speedUp}></div>
                <div className="Rippling"></div>
                <div className="TapToSpeedUp" onTouchTap={this._speedUp}></div>
                <div className="TapSpeed">{-gameData.props[0].tap_speed}</div>
                <div className={"BuildingInfo " + updateDisplay}>
                    <div className="LevelIndex"><span>{this.props.data.level}</span></div>
                    <div className="LevelName">{this.props.data.name}</div>
                    <div className={"LevelProfitSpeed"}>收益：¥{Utils.numberToShort(this.props.data.income)}/分钟</div>
                    <div className={"LevelMaxProfit"}>最大累计收益：¥{Utils.numberToShort(this.props.data.maxincome)}</div>
                    <div className="LevelThreat">威胁值：{this.props.data.threaten}%</div>
                </div>
                <div className={"Obstacle "+createNewDisplay}></div>
                <div className={"BuildingCreateName "+createNewDisplay}>{this.props.data.name}</div>
                <div className={"BuildingCreateNote "+createNewDisplay}>施工中</div>
                <div className="BuildingCompleteNowBtn" onTouchTap={this._completeNow}>
                    <div className="Icon"></div>
                    <span>立即完成</span><br/>
                    <span className="Cost">{this.props.data.time_remaining ? Math.ceil(1 + this.props.data.time_remaining) : 2}</span>
                </div>
            </div>
        );
    }

});

module.exports = createBuilding;
