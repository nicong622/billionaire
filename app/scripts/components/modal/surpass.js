var React = require('react');
var ModalStore = require('../../stores/modal-store');
var Utils = require('../../utils/utils');
var ModalActions = require('../../actions/modal-actions');

function getState() {
    return ModalStore.getModalState()
}

var SurpassModal = React.createClass({
    getInitialState: function() {
        return {
            surpass: false,
            data: {}
        }
    },
    componentDidMount: function() {
        buttonLineHeight = document.querySelector(".SurpassModalButton").clientHeight
        document.querySelector(".SurpassModalButton").style.lineHeight = buttonLineHeight + "px";
        rewardHeight = document.querySelector(".reward").clientHeight
        document.querySelector(".reward").style.lineHeight = rewardHeight + "px";
        ModalStore.addChangeListener("surpass", this._update);
        setTimeout(function(){
            if (!!gameData.complete_achievement.id) {
                window.surpassData = gameData.complete_achievement
                ModalActions.showSurpassModal()
            }
        }, 1000)
    },
    componentWillUnmount: function() {
        ModalStore.removeChangeListener("surpass", this._update);
    },
    componentDidUpdate: function() {
        if (!!this.state.surpass) {
            $('.ModalMask').addClass('ModalMaskShow')
            // 打开
            window.surpassAndShareWeiXin = false;
            Utils.shareWeiXin(window.surpassData.share_msg,window.surpassData.share_msg, function(){
                $('.SurpassModalButton').text('领取奖励（双倍）').addClass('ModalButtonBule')
                window.getDoubleSurpassReward = 1;
            })
        } else {
            $('.ModalMask').removeClass('ModalMaskShow')
            // 关闭
            Utils.shareWeiXin()
            $('.SurpassModalButton').text('领取奖励').removeClass('ModalButtonBule')
            window.getDoubleSurpassReward = 0;
        }
    },
    _display: function() {
        if (!!this.state.surpass) {
            return "NormalModalShow"
        } else {
            return ""
        }
    },
    _update:function() {
        log("update surpass modal state");
        this.setState(getState());
    },
    _onTapClose: function() {
        log("click close in surpass modal");
        ModalActions.closeSurpassModal();
    },
    _getReward: function() {
        log("click reward btn in surpass modal");
        ModalActions.getSurpassReward();
    },
    render: function() {
        return (
            <div className="SurpassModal">
                <div className={"NormalModal ModalBorderGreen " + this._display()}>
                    <span className="NormalModalTitle">恭喜</span>
                    <span className="NormalModalCloseGreen" onTouchTap={this._onTapClose}></span>
                    <div className="SurpassModalUp">
                        <img src={gameData.user_info.pic_link}/>
                        <span className="SurpassModalUpUser">{gameData.user_info.nick_name}</span>
                        <span className="SurpassModalUpCash">{'￥'+Utils.numberToShort(gameData.score_info.worth)}</span>
                        <span className="SurpassModalUpIcon"></span>
                    </div>
                    <div className="SurpassModalDown">
                        <span className="SurpassModalDownIcon"></span>
                        <img src={window.surpassData.pic ? cdn + 'images/npc/' + window.surpassData.pic + '.jpg' : ''}/>
                        <span className="SurpassModalDownUser">{window.surpassData.nickname}</span>
                        <span className="SurpassModalDownCash">{'￥'+Utils.numberToShort(window.surpassData.condition)}</span>
                    </div>
                    <div className="reward">{'奖励 ' + window.surpassData.reward}</div>
                    <div className="Tip"><span className="TipIcon">TIP</span><span className="TipText">分享朋友圈双倍奖励</span></div>
                    <div className="SurpassModalButton NormalModalButton ModalButtonGreen" onTouchTap={this._getReward}>领取奖励</div>
                </div>
            </div>
        );
    }

});

module.exports = SurpassModal;
