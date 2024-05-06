import React, {Component} from 'react';
import {getUrlParams} from "../../utils";
import './idnex.css'
import axios from "axios";
import down from "../../static/image/arrow-down.png";
import right from "../../static/image/arrow-right.png";
import statusImg from '../../static/image/status-healthy.png'
import {createAreaChart} from "../../utils/echarts";
import {Progress, Tooltip} from "antd";
import SelectList from "../../utils/selectList";
import Top from "../../utils/top";

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            class:'',
            statusNumber: {},
            totalValue: 0,
            companyName: "",
            material: [],//材料
            design: [],//设计
            manufacture: [],//制造
            test: [],//测试
            completeTotal: 0,//产业完整度总量
            totalGdp: [],
            gdpRate:0,
            increaseArr:[],//gdp增减比
            rank:0
        }
    }

    async componentDidMount() {
        const urlParams = getUrlParams(window.location.href);
        this.setState({ companyName: urlParams.result.companyName, class: urlParams.result.class }, async () => {
            await this.getChainMsg();
            await this.getCompany();
        });
    }



    createCharts = (data) => {
        createAreaChart('createAreaChart',data);
    }


    //拿到不同年份总gdp
    getCompany = () => {
        const params={className: this.state.class}
        axios.get("/other/getCompany",{params}).then(res => {
            if (res.status === 200) {
                res.data[0].companyList.forEach((item, index) => {
                    if (item.name === this.state.companyName) {
                        const startYear = 2018;
                        const yearData = [];
                        const increaseArr= this.getRate(JSON.parse(item.companyGdpData[0].gdp))
                        for (let i = 0; i < JSON.parse(item.companyGdpData[0].totalGdp).length; i++) {
                            const currentGdp =JSON.parse(item.companyGdpData[0].gdp)[i]
                            const total =JSON.parse(item.companyGdpData[0].totalGdp)[i]
                            const arr=increaseArr[i]
                            const totalGdp = this.state.statusNumber.sum7To10 + this.state.statusNumber.sum3To6 + this.state.statusNumber.sumLessThan3
                            const healthy =((this.state.totalValue / totalGdp / 12) * 100).toFixed(2)
                            yearData.push({
                                label: startYear + i,
                                rank:((healthy-arr)/total*10000).toFixed(2),
                                value: ((currentGdp/total)*100).toFixed(2),
                                key: i
                            });
                        }
                        //计算增减比
                        this.setState({ totalGdp:  yearData.slice(0,6),gdpRate:yearData[0].value,increaseArr,rank:yearData[0].rank},()=>{
                            this.createCharts(yearData.slice(0,6));
                        })
                    }
                });
            }
        })
    }
    getRate=(data)=>{
        const arr=[]
        for (let i=0;i<data.length-1;i++) {
            const count=data[i+1]-data[i]
            const percentage=(count/data[i]).toFixed(2)
            arr.push(percentage)
        }
        return arr
    }

    getNumber = (data) => {
        let totalCounts = {
            sumLessThan3: 0,
            sum3To6: 0,
            sum7To10: 0,
        };
        let totalValue = 0
        for (let i in data) {
            // 遍历当前类别下的每个对象
            for (let item of data[i].material) {
                totalValue += item.value
                if (item.value < 3) {
                    totalCounts.sumLessThan3++;
                } else if (item.value >= 3 && item.value <= 6) {
                    totalCounts.sum3To6++
                } else if (item.value >= 7 && item.value <= 12) {
                    totalCounts.sum7To10++
                }
            }
        }
        return {totalCounts, totalValue};
    }
    getChainMsg = () => {
        const params = {statusName: this.state.companyName}
        axios.get("/other/getChainStatus", {params}).then(res => {
            if (res.status === 200) {
                res.data[0].chainStatusInfo.forEach(item => {
                    item.material = JSON.parse(item.material)
                })
                let statusNumber = this.getNumber(res.data[0].chainStatusInfo);
                this.setState({
                    statusNumber: statusNumber.totalCounts,
                    totalValue: statusNumber.totalValue,
                    material: res.data[0].chainStatusInfo[0].material,
                    design: res.data[0].chainStatusInfo[1].material,
                    manufacture: res.data[0].chainStatusInfo[2].material,
                    test: res.data[0].chainStatusInfo[3].material,
                    completeTotal: res.data[0].chainTotal
                })
            }
        })
    }

    handleChange = (e) => {
        this.setState({rank:e.rank,gdpRate:e.value})
    }

    render() {
        const {material, design, manufacture, test, statusNumber, totalValue, completeTotal,totalGdp,gdpRate,rank} = this.state
        const total = statusNumber.sum7To10 + statusNumber.sum3To6 + statusNumber.sumLessThan3
        const healthy =((totalValue / total / 12) * 100).toFixed(2)
        return (
            <div>
                <Top/>
                <div className={'status-content'}>
                <div className={'status-left-content'}>
                    <div className={'status-left-top'}>
                        <div className={'status-back'} onClick={() => {
                            window.history.back(-1)
                        }}>返回上一页
                        </div>
                        <div className={'status-select'}>
                            <SelectList changeCompany={this.handleChange} defaultCompany={"2018"} options={totalGdp}/>
                        </div>
                    </div>
                    <div className={'status-title'}>企业名称</div>
                    <div className={'status-companyName-title'}>{this.state.companyName}</div>
                    <div className={'status-title'}>健康状态与GDP</div>
                    <div className={'status-healthy'}>
                        <img className={'status-img'} src={statusImg} alt={''}/>
                        <div className={'status-healthy-box'}>
                            <div className={'status-healthy-item'}>
                                <div className={'status-healthy-title'}>产业健康度</div>
                                <div
                                    className={'status-healthy-box-number'}>{healthy}%
                                </div>
                            </div>
                            <div className={'status-healthy-item'}>
                                <div className={'status-healthy-title'}>健康度对GDP影响程度</div>
                                <div className={'status-healthy-box-number'}>{rank}%</div>
                            </div>
                        </div>
                        <div className={'status-healthy-rules'}>
                            产业健康度计算逻辑：<span>产业节点健康值之和/产业节点健康度的总数（单节点最高为12.00）</span>
                        </div>
                        <div className={'status-healthy-rules'}>
                            GDP影响程度计算逻辑：<span>(产业健康度/GDP增减比)/GDP总值</span>
                        </div>
                    </div>
                    <div id="createAreaChart" style={{marginTop: "10px", width: '100%', height: 230}}></div>
                    <div className={'status-Progress-box'}>
                        <div className={'status-Progress-item'}>
                            <Progress type="circle" percent={(total / completeTotal).toFixed(2) * 100} size="small"/>
                            <div className={'status-Progress-title'}>
                                产业完整度
                                <div className={'status-healthy-rules'}>
                                    计算逻辑：<span>企业模块数量/行业模块总数量</span>
                                </div>
                            </div>

                        </div>
                        <div className={'status-Progress-item'}>
                            <Progress type="circle" percent={gdpRate} size="small"/>
                            <div className={'status-Progress-title'}>
                                占该行业GDP比例
                                <div className={'status-healthy-rules'}>
                                    计算逻辑：<span>企业gdp/行业gdp总值</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className={'status-right-content'}>
                    <div className={'status-title'}>产业节点健康状态（最大健康值：12）</div>
                    <div className={'status-step1-2-box'}>
                        <div className={'chain-box'}>
                            <div className={'chain-title'}>材料</div>
                            <div className={'chain-wrap'}>
                                {
                                    material.map((item, index) => {
                                        return <div className={'chain-item'} key={index}>
                                            <div
                                                className={item.value <= 3 ? 'step-circle-red' : (item.value > 3 && item.value <= 7) ? 'step-circle-gray' : 'step-circle-blue'}></div>
                                            <Tooltip title={`健康值${item.value.toFixed(2)}`}>
                                                {item.name}材料
                                            </Tooltip>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className={'status-step1-2-img'}>
                            <img src={down} alt={''} style={{height: "46px"}}/>
                        </div>
                        <div className={'chain-box'}>
                            <div className={'chain-title'}>设计</div>
                            <div className={'chain-wrap'}>
                                {
                                    design.map((item, index) => {
                                        return <div className={'chain-item'} key={index}>
                                            <div
                                                className={item.value <= 3 ? 'step-circle-red' : (item.value > 3 && item.value <= 7) ? 'step-circle-gray' : 'step-circle-blue'}></div>
                                            <Tooltip title={`健康值${item.value.toFixed(2)}`}>
                                                {item.name}
                                            </Tooltip>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className={'status-step1-2-img'}>
                            <img src={down} alt={''} style={{height: "46px"}}/>
                        </div>
                    </div>
                    <div className={'status-step3-4-box'}>
                        <div className={'manufacture-box'}>
                            <div className={'chain-title'}>制造</div>
                            <div className={'manufacture-wrap'}>
                                {
                                    manufacture.map((item, index) => {
                                        return <div className={'manufacture-item'} key={index}>
                                            <div
                                                className={item.value <= 3 ? 'step-circle-red' : (item.value > 3 && item.value <= 7) ? 'step-circle-gray' : 'step-circle-blue'}></div>
                                            <Tooltip title={`健康值${item.value.toFixed(2)}`}>
                                                {item.name}
                                            </Tooltip>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <div className={'status-step3-4-img'}>
                            <img src={right} alt={''} style={{height: "46px"}}/>
                        </div>
                        <div className={'test-box'}>
                            <div className={'chain-title'}>测试</div>
                            <div className={'test-wrap'}>
                                {
                                    test.map((item, index) => {
                                        return <div className={'test-item'} key={index}>
                                            <div
                                                className={item.value <= 3 ? 'step-circle-red' : (item.value > 3 && item.value <= 7) ? 'step-circle-gray' : 'step-circle-blue'}></div>
                                            <Tooltip title={`健康值${item.value.toFixed(2)}`}>
                                                {item.name}
                                            </Tooltip>
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className={'status-legend'}>
                        图例说明
                        <div className={'status-legend-item'}>
                            <span className={'step-circle-blue'}></span>
                            <div>正面</div>
                            <div>{statusNumber.sum7To10}个</div>
                            <div>{((statusNumber.sum7To10 / total) * 100).toFixed(2)}%</div>
                        </div>
                        <div className={'status-legend-item'}>
                            <span className={'step-circle-gray'}></span>
                            <div>一般</div>
                            <div>{statusNumber.sum3To6}个</div>
                            <div>{((statusNumber.sum3To6 / total) * 100).toFixed(2)}%</div>
                        </div>
                        <div className={'status-legend-item'}>
                            <span className={'step-circle-red'}></span>
                            <div>负面</div>
                            <div>{statusNumber.sumLessThan3}个</div>
                            <div>{((statusNumber.sumLessThan3 / total) * 100).toFixed(2)}%</div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default Index;