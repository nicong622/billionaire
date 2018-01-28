var React = require('react');
var RankingListItem = require('./ranking-list-item');
var RankingListStore = require('../../stores/ranking-list-store');
var PanelActions = require('../../actions/panel-actions');

function getState() {
    return RankingListStore.getRankingState()
}

var RankingList = React.createClass({
    getInitialState: function() {
        return {
            show: false
        }
    },
    _share: function() {
        $('.ShareWeiXinWrap').removeClass("hidden")
    },
    componentDidUpdate: function() {
        if (this.state.show) {
            log("rankinglist iscroll init");
            var myScroll = new IScroll('#RankingListBox', {
                bounce:false,
                deceleration: 0.008
            });
            if (this.state.myRank>20) {
                myScroll.scrollTo(0, myScroll.maxScrollY, 0);
            }
        }
    },
    componentDidMount: function() {
        RankingListStore.addChangeListener(this._update);
        lineHeight = document.querySelector(".Friend").clientHeight;
        document.querySelector(".NavTabs>.Friend").style.lineHeight = lineHeight + "px";
        document.querySelector(".NavTabs>.Province").style.lineHeight = lineHeight + "px";
        document.querySelector(".NavTabs>.National").style.lineHeight = lineHeight + "px";
    },
    componentWillUnmount: function() {
        RankingListStore.removeChangeListener(this._update);
    },
    _update: function() {
        log("update ranking list state");
        this.setState(getState());
    },
    _display: function() {
        if (this.state.show) {
            return "RankingListShow"
        } else {
            return ""
        }
    },
    _onTapClose: function() {
        log("click close in ranking list");
        $('.NavTabs').children().removeClass("Active");
        $('.NavTabs').children().eq(0).addClass("Active");
        PanelActions.closeRankPanel();
    },
    _RankingListItem: function() {
        if (this.state.data) {
            dom = [];
            for (var i = 0; i < this.state.data.length; i++) {
                if (i < 3) {
                    this.state.data[i].number = i+1;
                    this.state.data[i].numberText = '';
                } else {
                    this.state.data[i].number = "";
                    this.state.data[i].numberText = "#"+(i+1);
                }
                if (this.state.data[i].headimgurl == gameData.user_info.pic_link) {
                    this.state.data[i].style = {"backgroundColor": "#fecf70"}
                    window.myindex = i;
                }
                if (!!this.state.myRank) {
                    if (i == 20) {
                        this.state.data[i].numberText = "#"+(this.state.myRank-2);
                    } else if (i == 21){
                        this.state.data[i].numberText = "#"+(this.state.myRank-1);
                    } else if (i == 22){
                        this.state.data[i].numberText = "#"+(this.state.myRank);
                    } else if (i == 23){
                        this.state.data[i].numberText = "#"+(this.state.myRank+1);
                    } else if (i == 24){
                        this.state.data[i].numberText = "#"+(this.state.myRank+2);
                    }
                }
                if (i > window.myindex) {
                    this.state.data[i].btnText = "收保护费";
                    this.state.data[i].btnStyle = {"backgroundColor": "#5ecd2b"}
                } else if (i == window.myindex) {
                    this.state.data[i].btnText = "";
                    this.state.data[i].btnStyle = {"display": "none"}
                }else {
                    this.state.data[i].btnText = "求赞助费"
                }
                dom.push(<RankingListItem key={i} data={this.state.data[i]}/>);
                // 插入分割线
                if (this.state.myRank>20){
                    if (i == 19) {
                        dom.push(<RankingListItem key={i+"line"}/>)
                    }
                }
            }
            return dom;
        }
    },
    _friend:function () {
        log("click friend tabs in ranking list");
        $('.NavTabs').children().removeClass("Active")
        $('.NavTabs').children().eq(0).addClass("Active")
         window.myindex = undefined;
        PanelActions.showRankPanel()
    },
    _province:function () {
        log("click province tabs in ranking list");
        $('.NavTabs').children().removeClass("Active")
        $('.NavTabs').children().eq(1).addClass("Active")
         window.myindex = undefined;
        PanelActions.showProvinceRank()
    },
    _national:function () {
        log("click national tabs in ranking list");
        $('.NavTabs').children().removeClass("Active")
        $('.NavTabs').children().eq(2).addClass("Active")
         window.myindex = undefined;
         PanelActions.showNationalRank()
    },
    render: function() {
        return (
            <div className={"RankingList " + this._display()}>
                <div className="RankingListClose" onTouchTap={this._onTapClose}></div>
                <h1>福布斯富豪榜</h1>
                <div className="NavTabs">
                    <div className="Friend Active" onTouchTap={this._friend}>好友</div>
                    <div className="Province" onTouchTap={this._province}>{gameData.user_info.province}</div>
                    <div className="National" onTouchTap={this._national}>全国</div>
                </div>
                <div className="RankingListBox" id="RankingListBox">
                    <div>
                        {this._RankingListItem()}
                    </div>
                </div>
                <div className="RankingListItemShare" onTouchTap={this._share}>召唤好友</div>
                <div className="cashIconAnimation-1"></div>
                <div className="cashIconAnimation-2"></div>
                <div className="cashIconAnimation-3"></div>
            </div>
        );
    }

});

module.exports = RankingList;
