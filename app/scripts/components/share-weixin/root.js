var React = require('react');

var ShareWeiXin = React.createClass({
    _close: function() {
        $('.ShareWeiXinWrap').addClass("hidden")
    },
    render: function() {
        return (
            <div className="ShareWeiXinWrap hidden">
                <div className="ShareWeiXinMask"></div>
                <div className="ShareWeiXin" onTouchTap={this._close}>
                    <img src={cdn + "images/girl-secretary.png"} />
                    <img src={cdn + "images/weixin-up.png"} />
                    <h3>第一步</h3>
                    <p>点击右上角，把全民首富<br/>分享给好友</p>
                    <h3>第二步</h3>
                    <p>让好友点开链接，TA就会成为你的好友</p>
                    <div className="Profile">
                        <p className="title">{gameData.user_info.nick_name + '：一起来创建商业帝国'}</p>
                        <img src={gameData.user_info.pic_link}/>
                        <p>我已经开启了自己的商业帝国，正在挑战王思聪和马云。</p>
                    </div>
                    <div className="Border"></div>
                    <div className="Tip1">
                        <div>TIP<br/>#1</div>
                        <p>点击好友分享来的链接，也有同样的效果哦。</p>
                    </div>
                    <div className="Tip2">
                        <div>TIP<br/>#2</div>
                        <p>每增加一个好友，威胁值将会永久-1%。</p>
                    </div>
                    <div className="Tip3">
                        <div>TIP<br/>#3</div>
                        <p>你每天可以向好友索取保护费或赞助费。</p>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = ShareWeiXin;
                    
