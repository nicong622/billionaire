var React = require('react');
var AlertModal = require('./alert');
var ThreatModal = require('./threat');
var SaleModal = require('./sale');
var UpgradeModal = require('./upgrade');
var SurpassModal = require('./surpass');
var ModalStore = require('../../stores/modal-store');

function getState() {
    return {
        show: ModalStore.getModalState().mask
    };
}

var Modal = React.createClass({
    getInitialState: function() {
        return {
            show: false
        }
    },
    componentDidMount: function() {
        ModalStore.addChangeListener("mask", this._update);
    },
    componentWillUnmount: function() {
        ModalStore.removeChangeListener("mask", this._update);
    },
    _update: function() {
        log("update mask state")
        this.setState(getState());
    },
    _display: function() {
        if (this.state.show) {
            return "ModalMaskShow"
        } else {
            return ""
        }
    },
    render: function() {
        return (
            <div className="Modal">
                <div className={"ModalMask " + this._display()}></div>
                <AlertModal />
                <ThreatModal />
                <SaleModal />
                <UpgradeModal />
                <SurpassModal />
            </div>
        );
    }

});

module.exports = Modal;
