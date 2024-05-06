import React, {Component} from 'react';
import './index.css'
import SelectList from "../../utils/selectList";
import {getUrlParams} from "../../utils";
import axios from "axios";
import Top from "../../utils/top/index";
import {createRunChart} from "../../utils/echarts";
class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            defaultTime:2017,
            defaultCompany:'',
            defaultIndex:'营业收入',
            timeList:[{
                year:'2017',value:2017
            },{
                year:'2018',value:2018
            },{
                year:'2019',value:2019
            },{
                year:'2020',value:2020
            },{
                year:'2021',value:2021
            },{
                year:'2022',value:2022
            },{
                year:'2023',value:2023
            }],
            companyOptions:[],
            indexList:[
                { value: '营业收入', label: '营业收入' },
                { value: '利润总额', label: '利润总额' },
                { value: '利润率', label: '利润率' },
                { value: '研发费用', label: '研发费用' }
            ],
            echartData:[],
            incomeAllList:[],
            profitAllList:[],
            profitRateList:[],
            researchAllList:[]
        }
    }

    componentDidMount() {
        const urlParams = getUrlParams(window.location.href);
        this.setState({ defaultCompany: urlParams.result.companyName },()=>{
            this.getCompany(urlParams.result.companyName.class)
        });
    }

    getCompany=(data)=>{
        const params={className: data}
        axios.get("/other/getCompany", {params}).then(res => {
            const companyList=[]
            if (res.status === 200) {
                res.data[0].companyList.forEach((item,index)=>{
                    companyList.push({label:item.name,value:item.name})
                })
                this.setState({companyOptions:companyList },()=>{
                    this.getRunCompany()
                })
            }
        })
    }

    getRunCompany=()=>{
        const params={company:this.state.defaultCompany}
        axios.get('/other/getRunCompany', {params}).then(res =>{
            if (res.status === 200) {
               const incomeAllList=JSON.parse(res.data.income)
               const profitAllList=JSON.parse(res.data.profit)
               const profitRateList=this.getProfitRateList(JSON.parse(res.data.income),JSON.parse(res.data.profit))
               const researchAllList=JSON.parse(res.data.research)
                this.setState({incomeAllList:incomeAllList,profitAllList:profitAllList,profitRateList:profitRateList,researchAllList:researchAllList},()=>{
                    this.getData()
                })
            }
        })
    }

    getData=()=>{
        const {incomeAllList,profitAllList,profitRateList,researchAllList}=this.state
        const List=this.state.defaultIndex==='营业收入'?incomeAllList:this.state.defaultIndex==='利润总额'?profitAllList:this.state.defaultIndex==='利润率'?profitRateList:researchAllList
        const yearList = List.find(item => this.state.defaultTime in item);
        const yearData = yearList[this.state.defaultTime];
        this.setState({echartData:yearData},()=>{
            this.createCharts();
        })
    }
    changeYear=(item)=>{
        this.setState({defaultTime:item.value},()=>{
            this.getData()
        })
    }

    changeIndex=(item)=>{
        this.setState({defaultIndex:item.value},()=>{
            this.getData()
        })
    }
    changeCompany=(data)=>{
        this.setState({defaultCompany:data},()=>{
            this.getRunCompany()
        })
    }

    createCharts = () => {
        createRunChart('createRunChart',this.state.echartData);
    }

    getProfitRateList=(income,profit)=>{
        const data = [];
        for (let i = 2017, j = 0; i <= 2023; i++, j++) {
            const annualData = [];
            for (let k = 0; k < income[j][i].length; k++) {
                let incomeItem = income[j][i][k];
                let profitItem = profit[j][i][k];
                let result = (profitItem / incomeItem * 100).toFixed(2);
                annualData.push(result);
            }
            data.push({ [i]: annualData });
        }
        return data;
    }
    render() {
        const {defaultTime,timeList,companyOptions,defaultCompany,defaultIndex,indexList}=this.state
        return (
            <div>
                <Top/>
                <div className={'run-content'}>
                    <div className={'run-left-content'}>
                        <div className={'run-left-top'}>
                            <div className={'run-back'} onClick={() => {
                                window.history.back(-1)
                            }}>返回上一页
                            </div>
                        </div>
                        <div className={'run-title'}>
                            产业选择
                        </div>
                        <div className={'run-industry-box'}>
                            <span>当前产业:</span><SelectList changeCompany={this.changeCompany} defaultCompany={defaultCompany} options={companyOptions}/>
                        </div>
                        <div className={'run-title'}>
                            年份选择
                        </div>
                        <div className={'run-time-box'}>
                            {
                                timeList.map((item,index)=>{
                                    return <div className={defaultTime===item.value?'run-time-item-active':'run-time-item'}
                                                key={index} onClick={()=>this.changeYear(item)}>
                                        {item.year}
                                    </div>
                                })
                            }

                        </div>
                        <div className={'run-title'}>
                            指标选择
                        </div>
                        <div className={'run-index-box'}>
                            {
                                indexList.map((item,index)=>{
                                    return <div className={defaultIndex===item.value?'run-index-item-active':'run-index-item'}
                                                key={index} onClick={()=>this.changeIndex(item)}>
                                        {item.label}
                                    </div>
                                })
                            }

                        </div>
                    </div>
                    <div className={'run-right-content'}>
                        <div className={'run-title'}>
                            <span>{defaultIndex}</span>趋势图
                        </div>
                        <div id="createRunChart" style={{marginTop: "10px", width: '100%', height: 600}}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;