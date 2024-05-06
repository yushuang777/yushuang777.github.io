import React, {Component} from 'react';
import {NavLink, Outlet} from "react-router-dom";
import {getUrlParams} from '../../utils/index';
import './index.css'

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            className: '',
            defaultUrl: 1,
            urlList: [{
                name: '产业全景', url: 'industry-panorama', value: 1
            }, {
                name: '产业检测', url: 'industry-detection', value: 2
            }, {
                name: '产业分析', url: 'industry-analysis', value: 3
            }, {
                name: '产业提升', url: 'industry-improve', value: 4
            }]
        };
    }

    componentDidMount() {
        const urlParams = getUrlParams(window.location.href);
        const updatedUrlList = this.state.urlList.map(item => {
            // 检查参数是否已存在
            const hasClassnameParam = item.url.includes('classname=');
            return {
                ...item,
                url: hasClassnameParam
                    ? item.url
                    : `${item.url}${item.url.includes('?') ? '&' : '?'}classname=${urlParams.result.classname}`,
            };
        });

        this.setState({className: urlParams.name, urlList: updatedUrlList});
    }


    change = (item) => {
        this.setState({defaultUrl: item.value})
    }

    render() {
        return (
            <div>
                <div className={'top'}>
                    <div className={'back'}>
                        <span onClick={() => {
                            window.location.href = '/home'
                        }}>返回首页</span>
                        <span className={'className'}>{this.state.className}</span>
                    </div>
                    <div className={'top-menu'}>
                        {
                            this.state.urlList.map((item, index) => {
                                return (
                                    <NavLink to={item.url} style={{textDecoration: "none"}} key={index}>
                                        <div key={index}
                                             className={item.value === this.state.defaultUrl ? 'nav-active' : 'nav'}
                                             onClick={() => this.change(item)}>

                                            <div className={'top-text'}>
                                                {item.name}
                                            </div>
                                        </div>
                                    </NavLink>

                                )
                            })
                        }
                    </div>
                </div>
                <Outlet/>
            </div>
        );
    }
}

export default Index;