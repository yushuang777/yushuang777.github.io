import React, {Component} from 'react';
import IndustryEvelopment from "./components/Industry-evelopment";
import IndustryRisk from "./components/industry-risk";
import './index.css'
import SelectList from "../../utils/selectList";
import axios from "axios";
import {getUrlParams} from "../../utils";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            defaultTab:'发展指数',
            tabList:[{
                name:'发展指数',value:'发展指数'
            },{
                name:'风险指数',value:'风险指数'
            }],
            defaultCompany:'',
            className:'',
            companyOptions:[],
            defaultYear:2018,
            yearOptions:[
                {label:2018,value:2018},
                {label:2019,value:2019},
                {label:2020,value:2020},
                {label:2021,value:2021},
                {label:2022,value:2022},
                {label:2023,value:2023}
            ],
            chainInfoList:[],
            companyList:[]
        }
    }
    changeTab=(item)=>{
        this.setState({defaultTab:item.value})
    }


    componentDidMount() {
        const urlParams = getUrlParams(window.location.href);
        this.getCompany(urlParams.result.classname)
    }
    getCompany=(data)=>{
        const params={className: data}
        axios.get("/other/getCompany", {params}).then(res => {
            const companyList=[]
            const chainInfoList=[]
            if (res.status === 200) {
                res.data[0].companyList.forEach((item,index)=>{
                    companyList.push({label:item.name,value:item.name})
                    chainInfoList.push({name:item.name,chainStatusInfoList:item.chainStatusInfoList,address:res.data[0].address})
                    item.companyGdpData.forEach(node=>{
                        node.gdp=JSON.parse(node.gdp)
                        node.totalGdp=JSON.parse(node.totalGdp)
                    })
                })
                chainInfoList.forEach((node)=>{
                    node.chainStatusInfoList.forEach(item => {
                        item.material = JSON.parse(item.material)
                    })
                })
                this.setState({companyOptions:companyList,defaultCompany:companyList[0].value,className:res.data[0].name,chainInfoList:chainInfoList,companyList:res.data[0].companyList})
            }
        })
    }

    handleYear=(data)=>{
        this.setState({defaultYear:data})
    }
    changeCompany=(data)=>{
        this.setState({defaultCompany:data})
    }

    render() {
        return (
            <div className={'analysis-content'}>
                <div className={'analysis-tabList-box'}>
                    {this.state.tabList.map((item,index)=>{
                        return <div key={index} className={item.value===this.state.defaultTab?'analysis-tabList-item-active':'analysis-tabList-item'}
                        onClick={()=>this.changeTab(item)}
                        >
                            {item.name}
                        </div>
                    })}
                </div>
                <div className={'analysis-select-box'}>
                    {this.state.defaultTab==="发展指数"&&
                        <div className={'analysis-select-item'}>
                            <span>当前年份:</span>
                            <SelectList changeCompany={this.handleYear} defaultCompany={this.state.defaultYear} options={this.state.yearOptions}/>
                        </div>
                    }
                    {this.state.defaultTab==="发展指数"&&
                        <div className={'analysis-select-item'}>
                            <span>当前企业:</span>
                            <SelectList changeCompany={this.changeCompany} defaultCompany={this.state.defaultCompany} options={this.state.companyOptions}/>
                        </div>
                    }
                    {this.state.defaultTab==="风险指数"&&
                        <div className={'analysis-select-item'}>
                            <span>当前年份:</span>
                            <div style={{marginLeft:"3px"}}>
                                2023
                            </div>
                        </div>
                    }
                    {this.state.defaultTab==="风险指数"&&
                        <div className={'analysis-select-item'}>
                            <span>当前产业:</span>
                            <div style={{marginLeft:"3px"}}>
                                {this.state.className}
                            </div>
                        </div>
                    }
                </div>

                    {this.state.defaultTab==="发展指数"&& <div className={'analysis-wrap'}>
                        <IndustryEvelopment defaultCompany={this.state.defaultCompany}  defaultYear={this.state.defaultYear} companyList={this.state.companyList} />
                    </div>}
                    {this.state.defaultTab==="风险指数"&& <div className={'analysis-wrap'}>
                        <IndustryRisk className={this.state.className} chainInfoList={this.state.chainInfoList} />
                    </div>}
            </div>
        );
    }
}

export default Index;