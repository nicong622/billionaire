var React = require('react');
var ModalStore = require('../../stores/modal-store');
var ModalActions = require('../../actions/modal-actions');

function getState() {
    return ModalStore.getModalState()
}

var SaleModal = React.createClass({
    getInitialState: function() {
        return {
            sale: false,
            data: {}
        }
    },
    componentWillUnmount: function() {
        ModalStore.removeChangeListener("sale", this._update);
    },
    componentDidMount: function() {
        buttonLineHeight = document.querySelector(".SaleModalButton").clientHeight
        document.querySelector(".SaleModalButton").style.lineHeight = buttonLineHeight + "px";
        ModalStore.addChangeListener("sale", this._update);
    },
    componentDidUpdate: function() {
        $('.ModalMask').toggleClass('ModalMaskShow')
    },
    _display: function() {
        if (this.state.sale) {
            return "NormalModalShow"
        } else {
            return ""
        }
    },
    _update: function() {
        log("update sale modal state");
        this.setState(getState());
    },
    _onTapClose: function() {
        log("click close in sale modal");
        ModalActions.closeSaleModal();
    },
    _onTapSale: function() {
        log("click sale in sale modal");
        ModalActions.saleBuilding();
    },
    _imagesId: function() {
        if (gameData.building_info.length > 0 && activeBuildingIndex < gameData.building_info.length) {
            return gameData.building_info[activeBuildingIndex].id    
        } else {
            return '1'
        }
    },
    render: function() {
        return (
            <div className="SaleModal">
                <div className={"NormalModal ModalBorderRed " + this._display()}>
                    <span className="NormalModalTitle">{"出售 " + this.state.data.name}</span>
                    <span className="NormalModalClose" onTouchTap={this._onTapClose}></span>
                    <img className="ModalBuilding" src={cdn+"images/building/" + this._imagesId() + ".png"} />
                    <div className="SaleModalNote">
                        <span className="SaleModalNoteTitle">{this.state.data.name}</span>
                        <p>售出价格：￥{Math.round(this.state.data.price*0.6)}<br/>威胁值：-{this.state.data.threaten}%</p>
                    </div>
                    <div className="SaleModalButton NormalModalButton ModalButtonRed" onTouchTap={this._onTapSale}>立即出售 !</div>
                </div>
            </div>
        );
    }

});

module.exports = SaleModal;
