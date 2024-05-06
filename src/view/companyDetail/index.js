import React, {Component} from 'react';
import './index.css'
import axios from "axios";
import {getUrlParams} from "../../utils";
import Top from "../../utils/top";
import Jcxx from "./components/jcxx";
import Tzfx from "./components/tzfx";
import Zscl from "./components/zscl";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            companyName:'',
            companyDetail:{},
            defaultTab:'jcxx',
            tabber:[{
                name:'基础信息',value:'jcxx'
            },{
                name:'投资分析',value:'tzfx'
            },{
                name:'综合意见',value:'cycl'
            }],
            chainList:[],
            companyInfo:[],
            investList:[],
            getChainInfo:[],
            getRunCompany:[]
        }
    }
    componentDidMount() {
        const urlParams = getUrlParams(window.location.href);
        this.setState({ companyName: urlParams.result.companyName },()=>{
            this.getCompanyDetail();
            this.getChain();
        });
    }

    getCompanyDetail = () => {
        const params = {statusName: this.state.companyName}
        axios.get("/other/getChainStatus", {params}).then(res => {
            if (res.status === 200) {
                const chainList=[]
                res.data[0].chainStatusInfo.forEach(item=>{
                    JSON.parse(item.material).forEach(node=>{
                        chainList.push({name:node.name})
                    })
                })
                this.setState({companyDetail:res.data[0],chainList:chainList})
            }
        })
    }

    getChain=()=>{
        const params={name:this.state.companyName}
        axios.get("/other/getChain", {params}).then(res => {
            if (res.status === 200) {
                const info = [
                    { "left": "企业名称", "leftValue": res.data[0].name, "right": "注册资本", "rightValue": res.data[0].registeredCapital },
                    { "left": "注册地址", "leftValue": res.data[0].registeredAddress, "right": "行业类型", "rightValue": res.data[0].className  },
                    { "left": "经营状态", "leftValue": res.data[0].businessStatus, "right": "成立日期", "rightValue": res.data[0].establishmentDate },
                    { "left": "法定代表人", "leftValue": res.data[0].legalRepresentative, "right": "所属地区", "rightValue": res.data[0].region },
                    { "left": "经营期限", "leftValue": res.data[0].establishmentDate+"-长期", "right": "企业类型", "rightValue": "股份有限公司（上市）" },
                    { "left": "所属地区", "leftValue": "杭州市" }
                ];
                this.setState({companyInfo:info ,getChainInfo:res.data[0]})
            }
        })
    }

    getInvestment=()=>{
        const params={company:this.state.companyName}
        axios.get("/other/getInvestment", {params}).then(res => {
            if (res.status === 200) {
                this.setState({investList:res.data.investmentAnalysis})
            }
        })
    }

    getRunCompany=()=>{
        const params={company:this.state.companyName}
        axios.get('/other/getRunCompany', {params}).then(res =>{
            if (res.status === 200) {
                const incomeAllList=JSON.parse(res.data.income)
                const profitAllList=JSON.parse(res.data.profit)
                const getRunCompany={incomeAllList,profitAllList}
                this.setState({getRunCompany:getRunCompany})
            }
        })
    }


    changeTab=(item)=>{
        this.setState({defaultTab:item.value})
        if(item.value==="tzfx"){
            this.getInvestment()
        }else if(item.value==="cycl"){
            this.getInvestment()
            this.getRunCompany()
        }
    }
    render() {
        return (
            <div>
                <Top/>
                <div className={'detail-content'}>
                    <div className={'detail-back'} onClick={() => {
                        window.history.back(-1)
                    }}>
                        返回上一页
                    </div>
                    <div className={'detail-company'}>
                        <div className={'detail-company-top'}>
                            <div className={'detail-company-name'}>
                                {this.state.companyName}
                            </div>
                            <div className={'detail-company-content'}>
                                <div className={'detail-company-wrap'}>
                                    <span>联系电话：</span>xxxx7892(暂无)
                                </div>
                                <div className={'detail-company-wrap'}>
                                    <span>注册地址：</span>{this.state.companyDetail.address}
                                </div>
                            </div>
                            <div className={'detail-company-introduce'}>
                                <span>公司介绍：</span>若要了解详情，请访问相关官网
                            </div>
                        </div>
                        <div className={'detail-tab-box'}>
                            {
                                this.state.tabber.map((item,index)=>{
                                    return <div className={this.state.defaultTab===item.value?'detail-tab-item-active':'detail-tab-item'} key={index} onClick={()=>this.changeTab(item)}>
                                        {item.name}
                                    </div>
                                })
                            }
                        </div>
                        <div className={'detail-tab-content'}>
                            {
                                this.state.defaultTab==="jcxx"&&
                                <Jcxx chains={this.state.chainList} companyInfo={this.state.companyInfo}/>
                            }
                            {
                                this.state.defaultTab==="tzfx"&&
                                <Tzfx investList={this.state.investList} companyDetail={this.state.companyDetail}/>
                            }
                            {
                                this.state.defaultTab==="cycl"&&
                                <Zscl getChainInfo={this.state.getChainInfo}  investList={this.state.investList} getRunCompany={this.state.getRunCompany}/>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;