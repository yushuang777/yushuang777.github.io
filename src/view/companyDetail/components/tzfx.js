import React, {Component} from 'react';
import './tzfx.css'
import {tzfxBarChart, tzfxLineChart, tzfxPieChart} from "../../../utils/echarts";
import money from '../../../static/image/money.png';
import capital from '../../../static/image/capital.png'
class Tzfx extends Component {
    constructor() {
        super();
        this.state={
            newFieldsName:[],
            topFiveName:[],
            newFields:[],
            topFive:[],
            money:0,
            fiveTotal:0,
            topFiveList:[]
        }
    }

    componentDidUpdate(prevProps, prevState) {
        //检查 props 是否发生变化
        if (this.props.investList !== prevProps.investList) {
            const newFields = this.props.investList[0].newFields
            const topFive = this.props.investList[0].topFive
            const newFieldsName = []
            JSON.parse(newFields).forEach(item => {
                newFieldsName.push(item.name)
            })
            const topFiveName = []
            JSON.parse(topFive).forEach(item => {
                topFiveName.push(item.name)
            })
            const money = this.props.companyDetail.money.replace(/[,()]/g, '');
            const fiveTotal=JSON.parse(topFive).reduce((accumulator, currentValue) => accumulator + currentValue.value, 0)
            this.setState({newFields:newFields,topFive:topFive,topFiveList:JSON.parse(topFive),newFieldsName:newFieldsName,topFiveName:topFiveName,money:money,fiveTotal:fiveTotal.toFixed(2)},()=>{
                this.createEcharts()
            })
        }
    }

    createEcharts=()=>{
        tzfxBarChart('tzfxBarChart',JSON.parse(this.state.newFields));
        tzfxLineChart('tzfxLineChart',JSON.parse(this.state.topFive));
        tzfxPieChart('tzfxPieChart1',JSON.parse(this.state.topFive),this.state.money,'对外投资金额/注册资本');
        tzfxPieChart('tzfxPieChart2',JSON.parse(this.state.topFive),this.state.money);
    }
    render() {
        const { newFieldsName, topFiveName,topFiveList,fiveTotal} = this.state;
        const sortList=topFiveList.sort((a, b) => b.value - a.value);
        return (
            <div className={'tzfx-content'}>
                <div className={'tzfx-warn'}>
                    <div className={'tzfx-title-wrap'}>
                        <div className={'tzfx-title'}>
                            投资规模分析
                        </div>
                    </div>
                    <div className={'tzfx-warn-content'}>
                        <div className={'tzfx-warn-text'}>
                            公司投资领域分布：投资最多的行业为：
                            <span className={'tzfx-warn-span'}>
                                {newFieldsName.map((item, index) => {
                                    return <span className={'tzfx-orange-text'} key={index}>
                                        {item}、
                                    </span>
                                })}
                            </span>
                            投资金额最大的为：
                            <span className={'tzfx-warn-span'}>
                                {topFiveName.map((item, index) => {
                                    return <span className={'tzfx-orange-text'} key={index}>
                                        {item}、
                                    </span>
                                })}
                            </span>
                            。
                        </div>
                    </div>
                    <div className={'tzfx-echarts-box'}>
                        <div className={'tzfx-echarts-item'} style={{width:"40%"}}>
                            <div className={'tzfx-title-orange'}>
                                企业对外投资分布
                            </div>
                            <div id="tzfxBarChart" style={{ width: '100%', height: 250}}></div>
                        </div>
                        <div className={'tzfx-echarts-item'} style={{width:"60%"}}>
                            <div className={'tzfx-title-orange'}>
                                企业对外投资产业（前五）
                            </div>
                            <div id="tzfxLineChart" style={{ width: '100%', height: 250}}></div>
                        </div>
                    </div>
                    <div className={'tzfx-title-wrap'}>
                        <div className={'tzfx-title'}>
                            对外投资资金规模
                        </div>
                    </div>
                    <div className={'tzfx-scale-box'}>
                        <div className={'tzfx-scale-item'}>
                            <img src={money} alt={''} style={{width:"24px",height:"24px"}}/>
                            <div style={{marginLeft:"6px"}}>
                                <span className={'tzfx-scale-number'}>{fiveTotal}</span><span style={{marginLeft:"4px"}}>万人民币</span>
                                <div className={'tzfx-scale-item-introduce'}>对外投资总金额</div>
                            </div>

                        </div>
                        <div className={'tzfx-scale-item'}>
                            <img src={capital} alt={''} style={{width:"24px",height:"24px"}}/>
                            <div style={{marginLeft:"6px"}}>
                                <span className={'tzfx-scale-number'}>{this.state.money.toString().replace('万元', '')}</span><span style={{marginLeft:"4px"}}>万人民币</span>
                                <div  className={'tzfx-scale-item-introduce'}>注册资本</div>
                            </div>
                        </div>
                    </div>
                    <div className={'tzfx-echarts-box'}>
                        <div className={'tzfx-echarts-item'}>
                            <div className={'tzfx-title-orange'}>
                                对外投资金额/注册资本
                            </div>
                            <div id="tzfxPieChart1" style={{ width: 200, height: 200}}></div>
                        </div>
                        <div className={'tzfx-echarts-item'}>
                            <div className={'tzfx-title-orange'}>
                                前五对外投资金额/总投资金额
                            </div>
                            <div id="tzfxPieChart2" style={{ width: 200, height: 200}}></div>
                        </div>
                    </div>
                    <div className={'tzfx-title-wrap'}>
                        <div className={'tzfx-title'}>
                            对外投资金额规模排名
                        </div>
                    </div>
                    <div className={'tzfx-table'}>
                        <table>
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>企业名称</th>
                                <th>投资金额</th>
                                <th>出资比例</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sortList && sortList.length > 0 && sortList.map((item, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.value}万人民币</td>
                                    <td>{(item.value/fiveTotal).toFixed(2)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

export default Tzfx;