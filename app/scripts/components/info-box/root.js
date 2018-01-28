var React = require('react');
var ScoreInfo = require('./score-info');
var UserInfo = require('./user-info');
var InfoBoxStore = require('../../stores/info-box-store');

function getState() {
    return {
        user_info: InfoBoxStore.getUserInfo(),
        score_info: InfoBoxStore.getScoreInfo()
    };
}

var InfoBox = React.createClass({
    getInitialState: function() {
        return getState();
    },
    componentDidMount: function() {
        InfoBoxStore.addChangeListener(this._update);
    },
    componentWillUnmount: function() {
        InfoBoxStore.removeChangeListener(this._update);
    },
    _update: function() {
        log("update info box");
        this.setState(getState());
    },
    render: function() {
        return (
            <div className="infoBox">
                <ScoreInfo data={this.state.score_info}/>
                <UserInfo data={this.state.user_info}/>
            </div>
        );
    }

});

module.exports = InfoBox;
