import React, {Component} from 'react';
import BusinessPortraits from "./components/businessPortraits";
import StandardDiagram from "./components/standardDiagram";
import './index.css'
import {Drawer} from "antd";
import companyIcon from "../../static/image/company.png";
import eyes from "../../static/image/eyes.png";
import axios from "axios";
import {getUrlParams} from "../../utils";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            menuValue:1,
            companyNameItem:{},
            menuList:[{title:'标准图谱',value:1},{title:'企业画像',value:2}],
            open:true,
            companyList:[],
            chain:{},
            info:[],
            companyIndex:0
        }
    }


     componentDidMount() {
        const urlParams = getUrlParams(window.location.href);
         this.setState({ className: urlParams.result.classname },()=>{
             this.getCompany();
         });
    }


    changeMenu=(item)=>{
        this.setState({menuValue:item.value},()=>{this.getChain(this.state.companyNameItem)})
    }

    getCompany=()=>{
        const params={className: this.state.className}
        axios.get("/other/getCompany", {params}).then(res => {
            const companyList=[]
            if (res.status === 200) {
                res.data[0].companyList.forEach((item,index)=>{
                    companyList.push({name:item.name})
                })
                this.setState({companyList:companyList },()=>{
                    this.getChain(this.state.companyList[0]);
                })
            }
        })
    }

    changeCompany=(item,index)=>{
        this.setState({companyIndex:index,companyNameItem:item},()=>this.getChain(item))
    }
    getChain=(item)=>{
        const params={name:item.name}
        axios.get("/other/getChain", {params}).then(res => {
            if (res.status === 200) {
                const info = [
                    { "left": "企业名称", "leftValue": res.data[0].name, "right": "注册资本", "rightValue": res.data[0].registeredCapital },
                    { "left": "注册地址", "leftValue": res.data[0].registeredAddress, "right": "企业类型", "rightValue": res.data[0].className  },
                    { "left": "经营状态", "leftValue": res.data[0].businessStatus, "right": "成立日期", "rightValue": res.data[0].establishmentDate },
                    { "left": "法定代表人", "leftValue": res.data[0].legalRepresentative, "right": "所属地区", "rightValue": res.data[0].region }
                ];
                this.setState({chain:res.data[0].chainInfo,info:info })
            }
        })
    }
    render() {
        const {open,companyList}=this.state
        const drawerStyles = {
            content: {
                background: '#242834',
            },
        };
        return (
            <div className={'panorama-content'}>
                <Drawer
                    styles={drawerStyles}
                    mask={false}
                    maskClosable={false}
                    placement={'left'}
                    closable={false}
                    onClose={()=>{this.setState({open:false})}}
                    open={open}
                >
                    {
                        companyList.map((item,index)=>{
                            return <div key={index} onClick={()=>{this.changeCompany(item,index)}} className={index===this.state.companyIndex?'panorama-company-item-active':'panorama-company-item'}>
                                <div className={'panorama-company-box'}>
                                    <img src={companyIcon} alt={''} style={{width:"20px"}}/>
                                    <div className={'company-title'}>
                                        {item.name}
                                    </div>
                                </div>
                                <div>
                                    <img src={eyes} alt={''} style={{width:"20px"}}/>
                                </div>
                            </div>
                        })
                    }
                </Drawer>
                <div className={'panorama-menu-box'} >
                {
                    this.state.menuList.map((item,index)=>{
                        return <div className={this.state.menuValue===item.value? 'panorama-menu-item-active':'panorama-menu-item'} key={index} onClick={()=>this.changeMenu(item)}>
                                {item.title}
                            </div>

                    })
                }
            </div>
                    {
                        this.state.menuValue===1&&
                        <BusinessPortraits chain={this.state.chain}/>
                    }
                    {
                        this.state.menuValue===2&&
                        <StandardDiagram info={this.state.info}/>
                    }
            </div>
        );
    }
}

export default Index;