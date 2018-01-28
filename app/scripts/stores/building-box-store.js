/* eslint-disable */
var AppDispatcher = require('../dispatcher/app-dispatcher');
var AppConstants = require('../constants/app-constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var landmark_info = require('../utils/sta_landmark');
var Utils = require('../utils/utils');
var BuildingBoxAction = require('../actions/building-box-actions');

var CHANGE_EVENT = 'change';
var _BuildingBoxState = {};

var BuildingBoxStore = assign({}, EventEmitter.prototype, {
    getState: function (){
        return _BuildingBoxState;
    },
     emitChange: function (){
        this.emit(CHANGE_EVENT);
    },
    addChangeListener: function (callback){
        this.on(CHANGE_EVENT, callback);
    },
    removeChangeListener: function (callback){
        this.removeListener(CHANGE_EVENT, callback);
    }
});

// 注册事件回调
AppDispatcher.register(function (action){
    switch (action.actionType){
        case AppConstants.UPGRADE_BUILDING:
            log("handle UPGRADE_BUILDING");
            $.post(hostUrl, {
                "cmd": 2002,
                "building_id": gameData.building_info[activeBuildingIndex].id
            }, function (response){
                // 通知服务端升级建筑
                if (response.status == "success"){
                    var building = gameData.building_info[activeBuildingIndex];
                    building.income = preUpgradeBuildingInfo.income;
                    building.maxincome = preUpgradeBuildingInfo.maxincome;
                    building.threaten = preUpgradeBuildingInfo.threaten;
                    building.level = preUpgradeBuildingInfo.level;
                    building.time = preUpgradeBuildingInfo.time;
                    building.price = preUpgradeBuildingInfo.price;
                    // 升级会自动收取已有的现金
                    // 根据返回用户数据，更新 UI
                    gameData.score_info.cash = response.data.cash;
                    gameData.score_info.threat = response.data.threat;
                    gameData.score_info.worth = response.data.total_property;
                    // 更新金钱显示
                    AppDispatcher.dispatch({
                        actionType: AppConstants.UPDATE_INFO_BOX
                    });
                    building.cash_pool = 0;
                    building.status = 1;
                    building.buildStart = Date.now();
                    building.time_remaining = preUpgradeBuildingInfo.time;
                    _BuildingBoxState.reload = 1;
                    _BuildingBoxState.slideToNew = 0;
                    // 建筑开始升级
                    var endTime = building.time * 60 + parseInt(Date.now() / 1000);
                    localStorage.setItem('billionaire-building-end-' + gameData.user_info.openid + '-' + building.id, endTime);
                    localStorage.setItem('speedUpCounting_' + building.id, '0');
                    building.time_build_end = endTime;
                    AppDispatcher.dispatch({
                        actionType: AppConstants.UPGRADE_BUILDING_START
                    });
                    BuildingBoxStore.emitChange();
                }else{
                    alert(response.msg);
                }
            });
            break;
        case AppConstants.BUILDING_CREATE_COMPLETE:
            log("handle BUILDING_CREATE_COMPLETE from building");

            if(!!gameData.building_info[activeBuildingIndex].completeByDiamond) {
                gameData.building_info[activeBuildingIndex].completeByDiamond = 0;
            } else{
                $('.network-loading').removeClass('hidden');
                $.post(hostUrl, {
                    "cmd": 2005,
                    "building_id": action.buildingId,
                    "click_times": action.click_times
                }, function(response){
                    var index = action.index;
                    $('.network-loading').addClass('hidden');
                    if(response.status == "success"){
                        localStorage.removeItem('billionaire-building-end-' + gameData.user_info.openid
                            + '-' + action.buildingId);
                        localStorage.removeItem('speedUpCounting_' + action.buildingId);
                        window.building_info[index].time_remaining = 0;
                        window.building_info[index].status = 2;
                        window.building_info[index].start = Date.now();
                        BuildingBoxAction.buildingCompleteConfirmed();
                    } else{
                        window.building_info[index].time_remaining = response.data.interval / 60;
                        window.building_info[index].status = 1;
                    }
                    _BuildingBoxState.reload = 1;
                    _BuildingBoxState.slideToNew = 0;
                    BuildingBoxStore.emitChange();
                });
            }
            break;
        case AppConstants.ADD_LANDMARK:
            log("handle ADD_LANDMARK");
            log('action.id ' + action.id);
            for (var key in landmark_info){
                if (landmark_info[key].id == action.id){
                    gameData.building_info.push(landmark_info[key]);
                    gameData.building_info[gameData.building_info.length - 1].id = action.id + 1000;
                    gameData.building_info[gameData.building_info.length - 1].status = 2;
                    gameData.building_info[gameData.building_info.length - 1].cash_pool = 0;
                    gameData.building_info[gameData.building_info.length - 1].type = 'landmark';
                    gameData.building_info[gameData.building_info.length - 1].start = Date.now();
                }
            }

            _BuildingBoxState.reload = 1;
            _BuildingBoxState.slideToNew = 0;
            BuildingBoxStore.emitChange();
            break;
        case AppConstants.BUILDING_COMPLETE_NOW:
            log("handle BUILDING_COMPLETE_NOW");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 2007,
                "building_id": action.buildingId,
                "left_time": parseInt(gameData.building_info[activeBuildingIndex].time_remaining * 60)
            }, function (response){
                $('.network-loading').addClass('hidden');
                if (response.status == "success"){
                    // 更新用户信息
                    gameData.score_info.cash = response.data.cash;
                    gameData.score_info.worth = response.data.total_property;
                    gameData.score_info.crystal = response.data.diamond;
                    gameData.score_info.threat = response.data.threat;
                    AppDispatcher.dispatch({
                        actionType: AppConstants.UPDATE_INFO_BOX
                    });
                    gameData.building_info[activeBuildingIndex].time_remaining = 0;
                    gameData.building_info[activeBuildingIndex].status = 2;
                    BuildingBoxAction.buildingCompleteConfirmed();
                }else{
                    alert(response.msg)
                }
                BuildingBoxStore.emitChange();
            });
            break;
        case AppConstants.CREATE_NEW_BUILDING:
            log("handle CREATE_NEW_BUILDING");
            $('.network-loading').removeClass('hidden');
            $.post(hostUrl, {
                "cmd": 2000,
                "building_id": buyBuildingInfo.id
            }, function (response){
                $('.network-loading').addClass('hidden');
                // 关闭 alert 弹窗
                AppDispatcher.dispatch({
                    actionType: AppConstants.CLOSE_ALERT_MODAL
                });
                if (response.status == "success"){
                    // 关闭面板
                    AppDispatcher.dispatch({
                        actionType: AppConstants.CLOSE_PANEL
                    });
                    // 更新可购买建筑
                    for (var key in buildingInfo){
                        if (buildingInfo[key].id == buyBuildingInfo.id){
                            var lastOne;

                            // 克隆对象
                            gameData.building_info.push(Utils.clone(buildingInfo[key]));

                            lastOne = gameData.building_info[gameData.building_info.length - 1];
                            lastOne.status = 0;
                            lastOne.buildStart = Date.now();
                            lastOne.time_remaining = lastOne.time;
                            lastOne.cash_pool = 0;
                            lastOne.level = 1;
                            var endTime = lastOne.time * 60 + parseInt(Date.now() / 1000);
                            localStorage.setItem('billionaire-building-end-' + gameData.user_info.openid + '-' + lastOne.id, endTime);
                            localStorage.setItem('speedUpCounting_' + lastOne.id, '0');
                            lastOne.time_build_end = endTime
                        }
                    }
                    _BuildingBoxState.reload = 1;
                    _BuildingBoxState.slideToNew = 1;
                    BuildingBoxStore.emitChange();
                    // 更新用户信息
                    gameData.score_info.cash = response.data.cash;
                    gameData.score_info.worth = response.data.total_property;
                    gameData.score_info.crystal = response.data.diamond;
                    gameData.score_info.threat = response.data.threat;
                    AppDispatcher.dispatch({
                        actionType: AppConstants.UPDATE_INFO_BOX
                    });
                }else{
                    alert(response.msg);
                }
            });
            break;
        case AppConstants.UPDATE_BUILDING:
            log("handle UPDATE_BUILDING");
            _BuildingBoxState.reload = 1;
            _BuildingBoxState.slideToNew = 0;
            BuildingBoxStore.emitChange();
            break;
        default:
        // pass
    }
});

module.exports = BuildingBoxStore;
