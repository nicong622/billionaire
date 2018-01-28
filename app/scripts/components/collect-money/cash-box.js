var React = require('react');

var cashBox = React.createClass({
    componentDidMount: function() {
    },
    componentWillUpdate: function() {
    },
    _cash: function() {
        if (window.innerHeight <= 416) {
            var h = 69
        } else {
            h = 44
        }
        if (this.props.data.maxincome >0) {
            var cash = this.props.data.cash_pool / this.props.data.maxincome * 67,
                dom = [];
            if (activeBuildingIndex < gameData.building_info.length) {
                for (var i = 0; i < cash; i++) {
                    dom.push(<div className="cash" key={i} style={{marginTop: h - i * 2.5}}></div>)
                }
            }
            return dom
        }
    },
    _display: function() {
        if (activeBuildingIndex == gameData.building_info.length) {
            return "hidden"
        }
        else if (gameData.building_info[activeBuildingIndex].cash_pool >= gameData.building_info[activeBuildingIndex].maxincome) {
            return ""
        } else {
            return "hidden"
        }
    },
    _publicDisplay: function() {
        if (this.props.data.maxincome == 0) {
            return "hidden"
        } else {
            return ""
        }
    },
    render: function() {
        return (
            <div className={this._publicDisplay()}>
                <div className="cube">
                    <span className={"fullIcon " + this._display()}></span>
                    <div className="cubeFront"></div>
                    <div className="cashAnimationWrapper-1">
                        <div className="cashAnimation-1"></div>
                    </div>
                    <div className="cashAnimationWrapper-2">
                        <div className="cashAnimation-0"></div>
                    </div>
                    <div className="cashAnimationWrapper-3">
                        <div className="cashAnimation-1"></div>
                    </div>
                    <div className="cashAnimationWrapper-4">
                        <div className="cashAnimation-0"></div>
                    </div>
                    <div className="cashAnimationWrapper-5">
                        <div className="cashAnimation-1"></div>
                    </div>
                    <div className="cashAnimationWrapper-6">
                        <div className="cashAnimation-0"></div>
                    </div>
                    <div className="cashAnimationWrapper-7">
                        <div className="cashAnimation-1"></div>
                    </div>
                    <div className="cubeLeft"></div>
                    {this._cash()}
                </div>
            </div>
        );
    }

});

module.exports = cashBox;
