var React = require('react');
var PanelActions = require('../../actions/panel-actions');

var SorceryItem = React.createClass({
    componentDidMount: function() {
        function count() {
            if (window.stateProtectionEnd>0) {
                var now = Date.now()
                if (now-stateProtectionCount>=1000) {
                    var second = window.stateProtectionEnd -  now / 1000
                    if (second>=0) {
                        var time = second.toString().toHHMMSS()
                        $('.SorceryItemBtn').eq(1).text(time)
                        stateProtectionCount = now;
                    } else {
                         $('.SorceryItemBtn').eq(1).text(300)
                    }
                }
            }
            requestAnimationFrame(count); 
        }
        window.stateProtectionCount = Date.now()
        requestAnimationFrame(count);
    },
    _onTapSorceryItemBtn: function() {
        log("click SorceryItemBtn in sorcery panel");
        if (this.props.data.id == 1) {
            PanelActions.buySorceryItem(this.props.data.id)
        } else if (Date.now() / 1000 >= window.stateProtectionEnd) {
            PanelActions.buySorceryItem(this.props.data.id)
        } 
    },
    render: function() {
        if (this.props.data.id == 1) {
            var num =  this.props.data.diamond
            var divClass =  "DiamondIcon"
        } else if (Date.now() / 1000 >= window.stateProtectionEnd) {
            var num =  this.props.data.diamond
            var divClass =  "DiamondIcon"
        } else {
            var num = (window.stateProtectionEnd -  Date.now() / 1000).toString().toHHMMSS()
            var divClass =  "SorceryItemTimer"
        }
        return (
            <div className="SorceryItem">
                <p className="SorceryItemTitle">{this.props.data.name}</p>
                <img src={cdn+"images/" + this.props.data.picture + ".png"}/>
                <p className="SorceryItemText">{ this.props.data.desc}</p>
                <div className={"SorceryItemBtn " +divClass} onTouchTap={this._onTapSorceryItemBtn}>{num}</div>
            </div>
        );
    }

});

module.exports = SorceryItem;
