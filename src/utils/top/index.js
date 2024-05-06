import React, {Component} from 'react';
import './index.css'

class Index extends Component {
    constructor() {
        super();
        this.state = {}
    }

    componentDidMount() {

    }

    handleChange = (e) => {
        this.props.onSelect(e);
    };

    render() {
        return (
            <div className="top-content">
                <span className={'top-content-back'} onClick={() => {
                    window.location.href = '/home'
                }}>返回首页</span>
            </div>
        );
    }
}

export default Index;