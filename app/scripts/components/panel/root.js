var React = require('react');
var BusinessItem = require('./business');
var AchievementsItem = require('./achievements');
var LandmarkItem = require('./landmark');
var EventItem = require('./event');
var SaleItem = require('./sale');
var MessageItem = require('./message');
var SorceryItem = require('./sorcery');
var Punish = require('./punish');
var PanelStore = require('../../stores/panel-store');
var PanelActions = require('../../actions/panel-actions');

var icon;
var title;
var panel;

function getState() {
    return PanelStore.getPanelState()
}

var Panel = React.createClass({
    getInitialState: function() {
        return {
            root: false
        }
    },
    componentDidUpdate: function() {
        if (panel != "") {
            log("init scroll")
            var myScroll = new IScroll('#Scroll', {
                bounce: false
            });
        }
        if (this.state.show != "punish") {
            $('.Panel').toggleClass('PanelShow');    
        }
        if (this.state.show == 'landmark') {
            window.landmarkData = this.state.data;
        }
    },
    componentDidMount: function() {
        PanelStore.addChangeListener("panel", this._update);
    },
    componentWillUnmount: function() {
        PanelStore.removeChangeListener("panel", this._update);
    },
    _update: function() {
        log("update panel state");
        window.topTouchEnable = !window.topTouchEnable;
        this.setState(getState());
    },
    _display: function() {
        if (this.state.root) {
            return "PanelShow"
        } else {
            return ""
        }
    },
    _which: function() {
        var show = getState().show;
        switch (show) {
            case "business":
                icon =  "";
                title = "选择商业";
                panel = "business";
                break;
            case "sorcery":
                icon =  "SorceryItemIcon";
                title = "道具";
                panel = "sorcery";
                break;
            case "sale":
                icon =  "SaleItemIcon";
                title = "商城";
                panel = "sale";
                break;
            case "message":
                icon =  "MessageItemIcon";
                title = "信息";
                panel = "message";
                break;
            case "landmark":
                icon =  "LandmarkIcon";
                title = "地标";
                panel = "landmark";
                break;
            case "events":
                icon =  "";
                title = "活动";
                panel = "events";
                break;
            case "achievements":
                icon =  "AchievementsIcon";
                title = "成就";
                panel = "achievements";
                break;
            default:
                icon = "";
                title = "";
                panel = "";
        }
    },
    _onTapClose: function() {
        log("click close in panel");
        PanelActions.closePanel();
    },
    _panelItem: function() {
        var dom = [];
        switch (panel) {
            case "business":
                data = getState().data;
                for (var i=0; i < data.length; i++) {
                    if (i % 2 == 0 && i <= data.length-2) {
                        dom.push(
                            <tr key={i}>
                                <td><BusinessItem data={data[i]} /></td>
                                <td><BusinessItem data={data[i+1]} /></td>
                            </tr>
                        )
                    }
                    if (i > 2 && gameData.score_info.worth<data[i-2].condition) {
                        break;
                    }
                }
                return <table><tbody>{dom}</tbody></table>;
                break;
            case "sorcery":
                data = getState().data;
                for (var i=0; i < data.length; i++) {
                    dom.push(
                        <SorceryItem key={i} data={data[i]}/>
                    )
                }
                return <div className="SorceryItemWrapper">{dom}</div>;
                break;
            case "sale":
                data = getState().data;
                for (var i=0; i < data.length; i++) {
                    if (i % 2 == 0) {
                        dom.push(
                            <tr key={i}>
                                <td><SaleItem data={data[i]} /></td>
                                <td><SaleItem data={data[i+1]} /></td>
                            </tr>
                        )
                    }
                }
                return <table><tbody>{dom}</tbody></table>;
                break;
            case "message":
                data = getState().data;
                for (var i=0; i < data.length; i++) {
                    dom.push(
                        <MessageItem key={i} data={data[i]}/>
                    )
                }
                return <div>{dom}</div>
                break;
            case "landmark":
                for (var i=0; i < this.state.data.length; i++) {
                    dom.push(
                        <LandmarkItem key={i} data={this.state.data[i]}/>
                    )
                }
                return <div>{dom}</div>
                break;
            case "events":
                for (var i=0; i < this.state.data.length; i++) {
                    dom.push(
                        <EventItem key={i} data={this.state.data[i]}/>
                    )
                }
                return <div>{dom}</div>
                break;
            case "achievements":
                for (var i=0; i < this.state.data.length; i++) {
                    dom.push(
                        <AchievementsItem key={i} data={this.state.data[i]}/>
                    )
                }
                return <div>{dom}</div>
                break;
            default:
                // pass
        }
        
    },
    render: function() {
        this._which();
        return (
            <div>
                <Punish data={this.state.data || gameData.punishment}/>
                <div className="Panel">
                    <div className="PanelClose" onTouchTap={this._onTapClose}></div>
                    <div className={"PanelBoxTitle " + icon}>{title}</div>
                    <div className="PanelBox" id="Scroll">
                        {this._panelItem()}                    
                    </div>
                </div>
                <div className="diamondIconAnimation-1"></div>
                <div className="diamondIconAnimation-2"></div>
                <div className="diamondIconAnimation-3"></div>
            </div>
        );
    }

});

module.exports = Panel;
