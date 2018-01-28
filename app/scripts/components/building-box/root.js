var React = require('react');
var BuildingBoxStore = require('../../stores/building-box-store');
var BuildingBoxActions = require('../../actions/building-box-actions');
var CreateBuilding = require('./create-building');
var UpgradeBuilding = require('./create-building');

function getState() {
    return BuildingBoxStore.getState();
}

var BuildingBox = React.createClass({
    componentDidMount: function() {
        var $gongDi = $('.GongDi');
        window.building_info = gameData.building_info;

        $gongDi.on('touchstart', function(e){
            log('GongDi touchstart');
            $('.TapToSpeedUp').addClass('TapToSpeedUpActive')
        });
        $gongDi.on('touchend', function(e){
            log('GongDi touchend');
            $('.TapToSpeedUp').removeClass('TapToSpeedUpActive')
        });

        function count() {
            var now = Date.now();

            // 循环更新正在建筑的剩余时间
            for (var i = 0; i < building_info.length; i++) {
                if (building_info[i].status < 2) {
                    var duration = now - building_info[i].buildStart;
                    // 超过间隔时间
                    if (duration >= 1000 && building_info[i].time_remaining>1/60) {
                        building_info[i].time_remaining -= duration/1000/60;
                        if( building_info[i].time_remaining < 0 ) {
                            building_info[i].time_remaining = 0;
                        }

                        building_info[i].buildStart = Date.now();
                        if(activeBuildingIndex != gameData.building_info.length && building_info[activeBuildingIndex].status != 2) {
                            $('.Remaining>div')
                                .css('width', building_info[activeBuildingIndex].time_remaining/building_info[activeBuildingIndex].time * 100 + "%");
                            $('.Remaining>span').html(Math.floor(building_info[activeBuildingIndex].time_remaining*60) + "s")
                        }
                    } else if (building_info[i].time_remaining <= 1/60) {
                        log(building_info[i].name + "建造完成");
                        //// 建筑状态
                        window.building_info[i].status = 2;
                        BuildingBoxActions.buildingCreateComplete(building_info[i].id, i);
                    }

                }
            }
            requestAnimationFrame(count)
        }

        for (var i = 0; i < building_info.length; i++) {
            if (building_info[i].status != 2) {
                building_info[i].buildStart = Date.now();
            }
        }

        requestAnimationFrame(count);

        BuildingBoxStore.addChangeListener(this._update);
        //window.location.hash = "#swiper-998"
        window.BuildingBoxSwiper = new Swiper('.swiper-container', {
            direction: 'horizontal',
            speed: 500,
            hashnav: true,
            lazyLoading: true,
            onSlideChangeStart: function(swiper){
                window.hashChangeFromSwiper = true;
                log('building slide change');
                window.activeBuildingIndex = swiper.activeIndex;
                $($(".cash").get().reverse()).each(function() {
                    $(this).css('-webkit-transition', '');
                    $(this).css('-webkit-transform', '');
                    $(this).css('opacity', 1);
                    i++;
                });
                if (activeBuildingIndex != gameData.building_info.length && building_info[activeBuildingIndex].status == 2 && gameData.building_info[activeBuildingIndex].cash_pool >= gameData.building_info[activeBuildingIndex].maxincome) {
                    $('.fullIcon').removeClass('hidden')
                }

                BuildingBoxActions.buildingSlideChange();

                if(activeBuildingIndex != gameData.building_info.length && building_info[activeBuildingIndex].status != 2) {
                    $('.Remaining>div').css('width', building_info[activeBuildingIndex].time_remaining/building_info[activeBuildingIndex].time * 100 + "%");
                    $('.Remaining>span').html(parseInt(building_info[activeBuildingIndex].time_remaining*60) + "s")
                }
            }
        });
        // url hash 变化的时候切换建筑
        window.addEventListener("hashchange", function(e) {
            // 如果是组件触发的 url 变化，不进行建筑切换
            if (!window.hashChangeFromSwiper) {
                if (window.location.hash.startsWith('#swiper-')) {
                    if (window.location.hash.slice(8) == 999) {
                        index = 3;
                    } else {
                        index = parseInt(window.location.hash.slice(8))
                    }
                    log("slide to " + index + " swiper from hashchange");
                    window.BuildingBoxSwiper.slideTo(index)
                }
            }
            // reset
            window.hashChangeFromSwiper = false;
        }, false);
    },
    componentDidUpdate: function() {
        var $GongDi = $('.GongDi');

        BuildingBoxSwiper.update(false);
        if (!!this.state.slideToNew) {
            BuildingBoxSwiper.slideTo(gameData.building_info.length-1);
            $('.CreateBuildingAnimation').removeClass('hidden');
        }
        $GongDi.on('touchstart', function(e){
            log('GongDi touchstart');
            $('.TapToSpeedUp').addClass('TapToSpeedUpActive')
        });
        $GongDi.on('touchend', function(e){
            log('GongDi touchend');
            $('.TapToSpeedUp').removeClass('TapToSpeedUpActive')
        })
    },
    componentWillUnmount: function() {
        BuildingBoxStore.removeChangeListener(this._update);
    },
    _update:function() {
        log("update building box state");
        this.setState(getState());
        if (!!this.state.reload) {
            this.props.data = gameData.building_info;
        } else {
            log("slide to the " + this.state.show + " building");
            window.BuildingBoxSwiper.slideTo(this.state.show);
        }
    },
    _swiperPrev: function() {
        window.BuildingBoxSwiper.slidePrev();
    },
    _swiperNext: function() {
        window.BuildingBoxSwiper.slideNext();
    },
    _createNew: function() {
        log('click createNew on building info');
        BuildingBoxActions.createNewBuilding()
    },
    render: function() {
        var createBuildingDisplay,
            domClass;

        if (gameData.building_info.length > 0 && activeBuildingIndex != gameData.building_info.length) {
            if (gameData.building_info[activeBuildingIndex].status == 2 || gameData.building_info[activeBuildingIndex].status == 99) {
                createBuildingDisplay = 'hidden'
            } else {
                createBuildingDisplay = ' '
            }
        } else {
            createBuildingDisplay = 'hidden'
        }

        var swiperItem = [];
        for (var i=0; i < this.props.data.length; i++) {
            if (this.props.data[i].type == 'landmark'){
                domClass = 'landmark-img'
            } else {
                domClass = ''
            }
            if (this.props.data[i].status == 2) {
                swiperItem.push(
                <div className="swiper-slide" data-hash={"swiper-"+i} key={this.props.data[i].id}>
                    <div className="building-wrap">
                        <img className={domClass} src={cdn+"images/building/" + this.props.data[i].id + ".png"}/>
                    </div>
                </div>
                )
            } else if (this.props.data[i].status == 0){
                swiperItem.push(
                    <div className="swiper-slide" data-hash={"swiper-"+i} key={this.props.data[i].id}>
                        <CreateBuilding data={this.props.data[i]}/>
                    </div>
                    )
            } else if (this.props.data[i].status == 1){
                swiperItem.push(
                    <div className="swiper-slide" data-hash={"swiper-"+i} key={this.props.data[i].id}>
                        <UpgradeBuilding data={this.props.data[i]}/>
                    </div>
                    )
            }
        }
        return (
            <div className="BuildingBox">
                <div className="swiper-container">
                    <div className="swiper-left-wrap" onTouchTap={this._swiperPrev}>
                        <div className="swiper-left"></div>
                    </div>
                    <div className="swiper-right-wrap" onTouchTap={this._swiperNext}>
                        <div className="swiper-right"></div>
                    </div>
                    <div className="swiper-wrapper">
                        {swiperItem}
                        <div className="swiper-slide" data-hash="swiper-999">
                            <div className="BuildingBoxNew">
                                <div className="BuildingBoxNewTitle"></div>
                                <div className="BuildingBoxNewFloor" onTouchTap={this._createNew}></div>
                                <div className="BuildingBoxNewAdd" onTouchTap={this._createNew}></div>
                                <div className="BuildingBoxNewAd"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"CreateBuildingAnimation " + createBuildingDisplay}>
                    <div className="WorkerWrapper WorkerPositionAnimation">
                        <div className="Worker WorkerRunAnimation"></div>
                    </div>
                    <div className="Excavator ExcavatorRunAnimation"></div>
                </div>
            </div>
        );
    }

});

module.exports = BuildingBox;
