var React = require('react');

var MessageItem = React.createClass({
    componentDidMount: function() {
    },
    render: function() {
        var date = new Date(this.props.data.time * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();
        var seconds = "0" + date.getSeconds();
        var formattedTime = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        if (this.props.data.headimgurl.length < 30) {
            var headimgurl = cdn + 'images/npc/'+ this.props.data.headimgurl
        } else {
            var headimgurl = this.props.data.headimgurl;
        }
        return (
            <div className="MessageItem">
                <p className="MessageItemUserName">{this.props.data.nickname}</p>
                <img src={headimgurl}/>
                <span className="MessageItemTime">{formattedTime}</span>
                <p className="MessageItemText">{this.props.data.content}</p>
            </div>
        );
    }

});

module.exports = MessageItem;
