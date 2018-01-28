var React = require('react');
var ModalActions = require('../../actions/modal-actions');

var SaleBtn = React.createClass({
    onTap: function() {
        log("click sale btn")
        ModalActions.showSaleModal();
    },
    _saleBtnDisplay: function() {
        if (!!!gameData.building_info[window.activeBuildingIndex]) {
            return "hidden"
        } else if (this.props.data.maxincome == 0 || gameData.building_info[window.activeBuildingIndex].type == "landmark" || this.props.data.sale == 0) {
            return "hidden"
        } else {
            return ""
        }
    },
    render: function() {
        return (
            <div className={"SaleBtn" + this._saleBtnDisplay()} onTouchTap={this.onTap}/>
        );
    }

});

module.exports = SaleBtn;
