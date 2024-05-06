import React, {Component} from 'react';
import './index.css'
import axios from "axios";
import {getUrlParams} from "../../utils";
import Echarts from "./components/echarts";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            className:"",
            company:0,
            name:'',//产业名称
            companyClass: '',
            companyList:[],
            companyList0:[],//type空
            companyList1:[],//type1
            companyList2:[],//type2
            companyList3:[],//type3
            companyGdpData:[],
            taberList: [{taber: '全部企业', type: '',number:0}, {taber: '小型企业', type:1,number:0}, {taber: '中型企业', type:2,number:0}, {taber: '大型企业', type:3,number:0}],
        };
    }

    componentDidMount() {
        const urlParams= getUrlParams(window.location.href)
        this.setState({className:urlParams.result.classname},()=>{
            this.getCompanyMsg();
        })
    }

    changeCompany=(item)=>{
        this.setState({companyClass:item.type,companyList:item.type===1?this.state.companyList1:item.type===2?this.state.companyList2
                :item.type===3?this.state.companyList3:this.state.companyList0},()=>{
            this.changeEcharts(this.state.companyList[0],0)
        })
    }

    changeEcharts=(item,index)=>{
        this.setState({companyGdpData:item.companyGdpData,company:index})
    }
    getCompanyMsg=()=>{
        const params={className: this.state.className}
        axios.get("/other/getCompany", {params}).then(res => {
            if (res.status === 200) {
                res.data[0].companyList.forEach((item,index)=>{
                    item.companyGdpData[0].gdp=JSON.parse(item.companyGdpData[0].gdp)
                    item.companyGdpData[0].year=JSON.parse(item.companyGdpData[0].year)
                })
                const list =res.data[0].companyList
                const companyList1=[]
                const companyList2=[]
                const companyList3=[]
                let totalGDP = 0;
                list.forEach((item) => {
                    if (item.type === 1) {
                        companyList1.push(item);
                    } else if (item.type === 2) {
                        companyList2.push(item);
                    } else if (item.type === 3) {
                        companyList3.push(item);
                    }

                    // 折线图计算
                    item.companyGdpData.growthRate = [];
                    // 饼图计算
                    item.companyGdpData.pieRate = [{value:'',year:''}];
                    const gdpData=item.companyGdpData[0].gdp
                    // 计算总的 GDP 量
                    for (let i = 0; i < gdpData.length; i++) {
                        totalGDP += gdpData[i];
                    }
                    // 遍历每年的 GDP 数据，从第二年开始计算增长率
                    for (let i = 1; i < gdpData.length; i++) {
                        const growthRate = ((gdpData[i] - gdpData[i - 1]) / gdpData[i - 1]) * 100;
                        item.companyGdpData.growthRate.push(growthRate);
                    }

                    // 计算每年的 GDP 情况占全部总量的比例
                    for (let i = 0; i < gdpData.length; i++) {
                        const year=2017
                        // 计算该年份 GDP 占总量的比例
                        const rate = (gdpData[i] / totalGDP) * 100;
                        item.companyGdpData.pieRate.push({ value: rate, name: year + i });
                    }
                });


                this.setState({name:res.data[0].name,companyList: res.data[0].companyList,companyGdpData: list[0].companyGdpData,companyList0: res.data[0].companyList,companyList1:companyList1,companyList2:companyList2,companyList3:companyList3}
                    //设置默认企业
                )
                this.state.taberList.forEach((item)=>{
                    if(item.type===1){
                        item.number=companyList1.length
                    }else if(item.type===2){
                        item.number=companyList2.length
                    }else if(item.type===3){
                        item.number=companyList3.length
                    }else{
                        item.number=res.data[0].companyList.length
                    }
                })
            }
        })
    }
    render() {
        return (
            <div className="detection-content">
                <div className="left-content">
                    <div>
                        <Echarts gdpEcharts={this.state.companyGdpData}/>
                    </div>
                </div>
                <div className="right-content">
                    <div className="menu-card-filter-box">
                        {
                            this.state.taberList.map((item, index) => {
                                const beforeTaber = item.taber.slice(0, 2);
                                const afterTaber = item.taber.slice(2, 4);
                                return<div className={'menu-box'} key={index}>
                                    <div className={item.type===this.state.companyClass?'menu-card-item-active':'menu-card-item'} key={index} onClick={()=>{this.changeCompany(item)}}>
                                        <div className='name'>
                                            <p>
                                                {beforeTaber}
                                            </p>
                                            <p>
                                                {afterTaber}
                                            </p>
                                        </div>
                                        <div className='number'>
                                            总数量：<span style={{color:"orange",fontWeight:600}}>{item.number}</span>
                                        </div>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                    <div className={'companyList'}>
                        <div className={'company-box'}>
                            {
                                this.state.companyList.map((item,index)=>{
                                    return <div className={index===this.state.company?'company-item-active':'company-item'} key={index} onClick={()=>{this.changeEcharts(item,index)}}>
                                        <div className={'company-title'}>
                                            {item.name}
                                        </div>
                                        <div style={{display:"flex",justifyContent:"space-between"}}>
                                            <div>
                                                <div className={'company-tab'}>
                                                    <div className={'company-wrap'}>
                                                        企业类型：<span className={'company-type'}>{item.type===1?'小型企业':item.type===2?'中型企业':'大型企业'}</span>
                                                    </div>
                                                </div>
                                                <div className={'company-content'}>
                                                    <div className={'company-wrap'}>
                                                        法人：{item.frName}
                                                    </div>
                                                    <div className={'company-wrap'}>
                                                        注册资本：{item.money}
                                                    </div>
                                                    <div className={'company-wrap'}>
                                                        成立日期：{item.time}
                                                    </div>
                                                </div>
                                                <div className={'company-address'}>
                                                    企业地址：{item.address}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="ztjc" onClick={() => {window.location.href=`/status-detection?companyName=${item.name}&&class=${this.state.className}`}}>
                                                    状态检测>
                                                </div>

                                                <div className={'yxjc'}  onClick={() => {window.location.href=`/run-detection?companyName=${item.name}&&class=${this.state.className}`}}>
                                                    运行监测>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;