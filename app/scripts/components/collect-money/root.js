var React = require('react');
var CashBox = require('./cash-box');
var SaleBtn = require('./sale-btn');
var UpgradeBtn = require('./upgrade-btn');
var BuildingInfo = require('./building-info');
var CollectBar = require('./collect-bar');
var CollectMoneyStore = require('../../stores/collect-money-store');

function getState(){
    return CollectMoneyStore.getState()
}

var CollectMoney = React.createClass({
    getInitialState: function (){
        return getState()
    },
    componentDidMount: function (){
        for (var i = 0; i < gameData.building_info.length; i++){
            if (gameData.building_info[i].status == 2 && gameData.building_info[i].cash_pool == gameData.building_info[i].maxincome && gameData.building_info[i].maxincome > 0){
                $('.fullAlert').attr('class', 'fullAlert')
            }
        }

        CollectMoneyStore.addChangeListener(this._update);

        var building_info = gameData.building_info;

        var that = this;

        function count(){
            var now = Date.now();
            if (activeBuildingIndex < building_info.length){
                // 循环将全部建筑的现金都不断递增
                for (var i = 0; i < building_info.length; i++){
                    if (building_info[i].status == 2 && building_info[i].maxincome > 0){
                        var duration = now - building_info[i].start;
                        // 每一个单位间隔时间
                        var timeout = 60 * 1000 / building_info[i].income;
                        // 最小的更新间隔是100毫秒
                        if (timeout < 100){
                            min_timeout = 100
                        }else{
                            min_timeout = timeout
                        }
                        // 超过间隔时间并且现金池小于最大值
                        if (duration >= min_timeout && building_info[i].cash_pool < building_info[i].maxincome){
                            // 根据时间间隔，算出收益增加数量
                            building_info[i].cash_pool += duration / timeout;
                            // 重置起点时间
                            building_info[i].start = Date.now();
                            // 现金池满，为避免计算误差溢出，直接修正为最大值
                            if (building_info[i].cash_pool >= building_info[i].maxincome){
                                $('.fullAlert').attr('class', 'fullAlert');
                                if (building_info[i].id == gameData.building_info[activeBuildingIndex].id){
                                    $('[class^="cashAnimationWrapper"]').hide()
                                }
                                building_info[i].cash_pool = building_info[i].maxincome;
                            }
                            if (building_info[activeBuildingIndex].status == 2){
                                // 渲染当前显示的建筑现金池
                                document.getElementById('BuildingMoney').innerText = parseInt(building_info[activeBuildingIndex].cash_pool);
                                // 重新渲染，让 cash-box 自己更新
                                that.state.cash_pool = building_info[activeBuildingIndex].cash_pool;
                                that.forceUpdate();
                            }
                        }
                    }
                }
            }
            requestAnimationFrame(count)
        }

        for (var i = 0; i < building_info.length; i++){
            if (building_info[i].status == 2){
                building_info[i].start = Date.now();
            }
        }

        requestAnimationFrame(count);
    },
    componentWillUnmount: function (){
        CollectMoneyStore.removeChangeListener(this._update);
    },
    _update: function (){
        log("update collect money state");
        var state = getState();
        this.setState(state);
    },
    _display: function (){
        if (!this.state.show){
            return 'hidden';
        }else{
            return '';
        }
    },

    render: function (){
        return (
            <div className={"collectMoney " + this._display()}>
                <CashBox data={this.state}/>
                <SaleBtn data={this.state}/>
                <UpgradeBtn data={this.state}/>
                <BuildingInfo data={this.state}/>
                <CollectBar data={this.state}/>
            </div>
        );
    }
});

module.exports = CollectMoney;
