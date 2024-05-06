import React, {Component} from 'react';
import {NavLink, Outlet} from "react-router-dom";
import Top from '../top/index';
import axios from 'axios'
import homeIcon from '../../static/image/homeIcon.png';
import './index.css'
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            taberClass: '',
            areaId:'',
            nameList: [],
            mapList: [],
            menuList: [],
            taberList: [{taber: '全部', class: ''}, {taber: '信息科技', class: 'xxkj'}, {taber: '先进制造', class: 'xjzz'}, {taber: '医药健康', class: 'yyjk'}],
        };
    }

    componentDidMount() {
        this.getHomeList()
    }

    getHomeList = (item) => {
            //如果两个参数都存在
            this.setState({taberClass:item?item.class:''})
            const params = {classType: item?item.class:'',areaId: this.state.areaId}
            axios.post("/other/homeList", params).then(res => {
                if (res.status === 200) {
                    this.setState({menuList: res.data})
                }
            })
    }

    select = (e) => {
        this.setState({areaId:e},()=>{
            this.getHomeList()
        })
    }
    render() {
        return (
            <div>
                <Top onSelect={this.select}/>
                <div className={'welcome'}>
                    <div className={'welcome-icon'}>
                        <img src={homeIcon} alt={''} style={{width:"40px"}}/>
                    </div>
                    <div className={'welcome-title'}>
                        您好，欢迎来到，
                        <div className={'welcome-title-s'}>
                            GDP监控分析平台
                        </div>
                    </div>
                </div>
                <div className="content">
                    <div className="menu-card-filter">
                        产业分类：
                        <div className="menu-card-filter-box">
                            {
                                this.state.taberList.map((item, index) => {
                                    return <div className={item.class===this.state.taberClass?'menu-card-item-active':'menu-card-item'} key={index} onClick={()=>this.getHomeList(item)}>
                                        {item.taber}
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className="menu-card-box">
                        {
                            this.state.menuList.map((item, index) => {
                                return (
                                    <NavLink to={`/map-home/industry-panorama?classname=${item.classname}`} key={index}>
                                    <div className="menu-cards"  key={index}>
                                        <div className="menu-card-mask">
                                            <div className="menu-card-mask-img">
                                                <img src={item.imgUrl} style={{height: "100%", width: "100%"}}
                                                     alt={''}/>
                                            </div>
                                            <div className="menu-card-mask-name">
                                                {item.name}
                                            </div>
                                        </div>
                                    </div>
                                    </NavLink>
                                );
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