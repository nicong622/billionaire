/**
 * Created by liangningcong on 16/1/7.
 */
var React = require('react');

var Notice = React.createClass({
    getInitialState(){
        var title = '',
            content = '',
            display = false;

        if(!!gameData.announcement && !!gameData.announcement.title) {
            title = gameData.announcement.title;
            content = gameData.announcement.content;
            display = true;
        }

        return ({
            title: title,
            content: content,
            display: display
        })
    },
    _close(){
        this.setState({
            display: false
        });
    },
    _isDisplay(){
        return this.state.display ? '' : 'hidden';
    },
    render(){
        return (
            <div id="notice" className={this._isDisplay()}>
                <div id="notice-mask"></div>
                <div id="notice-board">
                    <h3 id="notice-title">{this.state.title}</h3>
                    <p id="notice-content">
                        {this.state.content}
                    </p>
                    <div id="notice-btn" onTouchTap={this._close}>
                        关闭
                    </div>
                </div>
            </div>
        )
    }
});

module.exports = Notice;
