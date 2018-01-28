var React = require('react');
var ModalStore = require('../../stores/modal-store');
var ModalActions = require('../../actions/modal-actions');

function getState() {
    return {
        show: ModalStore.getModalState().threat
    };
}

var ThreatModal = React.createClass({
    getInitialState: function() {
        return {
            show: false
        }
    },
    componentWillUnmount: function() {
        ModalStore.removeChangeListener("threat", this._update);
    },
    componentDidMount: function() {
        buttonLineHeight = document.querySelector(".ThreatModalButton").clientHeight
        document.querySelector(".ThreatModalButton").style.lineHeight = buttonLineHeight + "px";
        ModalStore.addChangeListener("threat", this._update);
    },
    componentDidUpdate: function() {
        $('.ModalMask').toggleClass('ModalMaskShow')
    },
    _display: function() {
        if (this.state.show) {
            return "NormalModalShow"
        } else {
            return ""
        }
    },
    _update: function() {
        log("update threat modal state");
        window.topTouchEnable = !window.topTouchEnable;
        this.setState(getState());
    },
    _onTapClose: function() {
        log("click close in threat modal")
        ModalActions.closeThreatModal();
    },
    render: function() {
        return (
            <div className="ThreatModal">
                <div className={"NormalModal ModalBorderRed " + this._display()}>
                    <span className="NormalModalTitle">威胁值说明</span>
                    <p className="ThreatModalText"><b>威胁值</b>可不是个什么好东西，但它的提升最少能证明你的商业帝国在扩大。如果你的威胁值过高将会触发一系列的惩罚事件，这会造成你的经济损失，所以请你将威胁值控制在一个合理的范围内。</p>
                    <p className="ThreatModalNote"><span>小提示:</span><br/>每增加一个好友威胁值将会永久-1%</p>
                    <div className="ThreatModalButton NormalModalButton ModalButtonRed" onTouchTap={this._onTapClose}>关闭</div>
                </div>
            </div>
        );
    }

});

module.exports = ThreatModal;
