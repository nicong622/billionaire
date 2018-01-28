var React = window.React = require('react');
var injectTapEventPlugin = require("react-tap-event-plugin");
var Utils = require('./utils/utils');

var InfoBox = require('./components/info-box/root');
var ToolBar = require('./components/tool-bar/root');
var CollectMoney = require('./components/collect-money/root');
var BuildingBox = require('./components/building-box/root');
var Modal = require('./components/modal/root');
var Panel = require('./components/panel/root');
var Punish = require('./components/panel/punish');
var Notice = require('./components/notice/root');
var ShareWeiXin = require('./components/share-weixin/root');
var RankingList = require('./components/ranking-list/root');
var InfoBoxStore = require('./stores/info-box-store');

// 避免 iOS 点击事件延迟
injectTapEventPlugin();

Utils.StringtoHHMMSS();
Utils.fixData();
Utils.get_time_remaining_from_cache();

Utils.initShareWeiXin();
Utils.shareWeiXin();

var App = React.createClass({
    getInitialState: function() {
        return {
            data: gameData
        };
    },
    render: function() {
        return (
            <div>
                <InfoBox />
                <ToolBar />
                <CollectMoney />
                <BuildingBox data={this.state.data.building_info}/>
                <Panel />
                <Modal />
                <RankingList />
                <ShareWeiXin />
                <Notice />
            </div>
        );
    }
});

// 挂载 App 到指定节点
React.render(
    <App />,
    document.getElementById("app")
);

document.addEventListener("DOMContentLoaded", function(event) {
    Utils.stopTouchMove();
    Utils.css();
});
